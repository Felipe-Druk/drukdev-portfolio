/**************************************************************
 * INTERACTIVE DUNGEON UI — RPG CLASS SELECTOR & CV CHAMBER
 **************************************************************/

import {
    OMNISCIENT_CLASS_ID,
    CLASS_SPRITES,
    DUNGEON_CLASSES,
    DUNGEON_EXPERIENCE,
    DUNGEON_PROJECTS,
    DUNGEON_EDUCATION,
    DUNGEON_CERTIFICATIONS,
    filterItemsByClass,
    getWeaponsByClass
} from '../config/dungeonData.js';
import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { getLocalizedCvPath } from '../config/links.js';
import { THEME_PALETTES } from '../config/themes.js';
import { drawPixelSprite } from '../graphics/sprites.js';
import { playSound } from '../audio/soundEngine.js';

let currentDungeonView = 'select';
let selectedCardIndex = 0;
let activeChamberClassId = OMNISCIENT_CLASS_ID;

function getDungeonModal() {
    return document.getElementById('dungeonModal');
}

export function isDungeonModalOpen() {
    const modalElement = getDungeonModal();
    return Boolean(modalElement && !modalElement.classList.contains('hidden'));
}

function getDungeonTexts(language = getCurrentLanguage()) {
    return TRANSLATIONS[language].dungeon;
}

function updateCvDownloadLink(language = getCurrentLanguage()) {
    const downloadButton = document.getElementById('dungeonDownloadCvBtn');
    if (!downloadButton) return;

    const cvPath = getLocalizedCvPath(language);
    if (!cvPath) {
        downloadButton.classList.add('hidden');
        return;
    }

    const fileName = cvPath.split('/').pop() || 'CV-Felipe-Druk.pdf';
    downloadButton.classList.remove('hidden');
    downloadButton.href = cvPath;
    downloadButton.setAttribute('download', fileName);
}

function paintClassCardSprites() {
    const spritePalette = THEME_PALETTES.fantasy.spriteColors;
    DUNGEON_CLASSES.forEach((rpgClass) => {
        const canvasElement = document.getElementById(`dungeonClassSprite-${rpgClass.id}`);
        const spriteMatrix = CLASS_SPRITES[rpgClass.id];
        if (!canvasElement || !spriteMatrix) return;

        const context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        drawPixelSprite(context, spriteMatrix, 6, 6, 3, spritePalette);
    });
}

function updateClassCardHighlight() {
    const cards = document.querySelectorAll('[data-dungeon-class-card]');
    cards.forEach((cardElement, cardIndex) => {
        const isSelected = cardIndex === selectedCardIndex;
        cardElement.classList.toggle('dungeon-class-card-active', isSelected);

        const cursorIndicator = cardElement.querySelector('[data-class-cursor]');
        if (cursorIndicator) {
            cursorIndicator.textContent = isSelected ? '►' : '·';
        }
    });
}

function createStatBarRow(stat) {
    const statRow = document.createElement('div');
    statRow.className = 'space-y-1';

    const labelRow = document.createElement('div');
    labelRow.className = 'flex items-center justify-between text-[10px] font-bold';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'text-steel';
    nameSpan.textContent = stat.label;

    const valueSpan = document.createElement('span');
    valueSpan.className = 'text-bronze';
    valueSpan.textContent = `${stat.value}/100`;

    labelRow.appendChild(nameSpan);
    labelRow.appendChild(valueSpan);

    const track = document.createElement('div');
    track.className = 'dungeon-stat-track';

    const fill = document.createElement('div');
    fill.className = 'dungeon-stat-fill';
    fill.style.width = `${stat.value}%`;

    track.appendChild(fill);
    statRow.appendChild(labelRow);
    statRow.appendChild(track);
    return statRow;
}

function renderClassSelectCards() {
    const gridContainer = document.getElementById('dungeonClassGrid');
    if (!gridContainer) return;

    const language = getCurrentLanguage();
    const dungeonTexts = getDungeonTexts(language);
    gridContainer.innerHTML = '';

    DUNGEON_CLASSES.forEach((rpgClass, cardIndex) => {
        const card = document.createElement('article');
        card.setAttribute('data-dungeon-class-card', rpgClass.id);
        card.className = 'dungeon-class-card flex flex-col justify-between p-3.5 cursor-pointer';

        const topHeader = document.createElement('div');
        topHeader.className = 'flex items-center justify-between pb-2 mb-2.5 border-b-2 border-[#56616E]';

        const cursorBadge = document.createElement('span');
        cursorBadge.setAttribute('data-class-cursor', '');
        cursorBadge.className = 'font-gothic-pixel text-xs text-[#B92B92]';
        cursorBadge.textContent = cardIndex === selectedCardIndex ? '►' : '·';

        const codeBadge = document.createElement('span');
        codeBadge.className = 'font-gothic-pixel text-[9px] px-2 py-0.5 bg-[#0D0D0F] border border-[#56616E] text-bronze';
        codeBadge.textContent = rpgClass.code;

        topHeader.appendChild(cursorBadge);
        topHeader.appendChild(codeBadge);

        const identityBlock = document.createElement('div');
        identityBlock.className = 'flex items-center gap-3 mb-2.5';

        const iconBox = document.createElement('div');
        iconBox.className = 'w-12 h-12 shrink-0 bg-[#0D0D0F] border-2 border-[#56616E] flex items-center justify-center';

        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.id = `dungeonClassSprite-${rpgClass.id}`;
        spriteCanvas.width = 48;
        spriteCanvas.height = 48;
        spriteCanvas.className = 'w-12 h-12 block';
        iconBox.appendChild(spriteCanvas);

        const titleWrap = document.createElement('div');
        const classTitle = document.createElement('h3');
        classTitle.className = 'font-gothic-pixel text-[11px] text-bronze leading-snug';
        classTitle.textContent = rpgClass.name[language];

        const classRole = document.createElement('p');
        classRole.className = 'text-xs font-bold text-steel mt-0.5';
        classRole.textContent = rpgClass.role[language];

        titleWrap.appendChild(classTitle);
        titleWrap.appendChild(classRole);
        identityBlock.appendChild(iconBox);
        identityBlock.appendChild(titleWrap);

        const summaryText = document.createElement('p');
        summaryText.className = 'text-xs text-[#D8E2EB]/85 leading-relaxed mb-3';
        summaryText.textContent = rpgClass.summary[language];

        const statsContainer = document.createElement('div');
        statsContainer.className = 'space-y-2 mb-3.5 pt-2 border-t border-[#2B3138]';
        rpgClass.stats.forEach((stat) => {
            statsContainer.appendChild(createStatBarRow(stat));
        });

        const inspectPrompt = document.createElement('div');
        inspectPrompt.className = 'dungeon-card-cta text-center py-1.5 font-gothic-pixel text-[9px]';
        inspectPrompt.textContent = dungeonTexts.enterClassBtn;

        card.appendChild(topHeader);
        card.appendChild(identityBlock);
        card.appendChild(summaryText);
        card.appendChild(statsContainer);
        card.appendChild(inspectPrompt);

        card.addEventListener('mouseenter', () => {
            if (selectedCardIndex !== cardIndex) {
                selectedCardIndex = cardIndex;
                updateClassCardHighlight();
                playSound('starHover');
            }
        });

        card.addEventListener('click', () => {
            selectedCardIndex = cardIndex;
            updateClassCardHighlight();
            enterDungeonChamber(rpgClass.id);
        });

        gridContainer.appendChild(card);
    });

    paintClassCardSprites();
    updateClassCardHighlight();
}

function renderChamberHeaderBanner(classId, language, dungeonTexts) {
    const bannerContainer = document.getElementById('dungeonChamberBanner');
    if (!bannerContainer) return;

    bannerContainer.innerHTML = '';
    const activeClass = DUNGEON_CLASSES.find((rpgClass) => rpgClass.id === classId);

    const titleEl = document.createElement('h3');
    titleEl.className = 'font-gothic-pixel text-xs sm:text-sm text-bronze';
    titleEl.textContent = activeClass
        ? `${activeClass.code} // ${activeClass.name[language]} — ${activeClass.role[language]}`
        : dungeonTexts.omniscientBannerTitle;

    const descEl = document.createElement('p');
    descEl.className = 'text-xs text-steel mt-1';
    descEl.textContent = activeClass
        ? activeClass.summary[language]
        : dungeonTexts.omniscientBannerDesc;

    bannerContainer.appendChild(titleEl);
    bannerContainer.appendChild(descEl);
}

function renderWeaponsSection(classId) {
    const weaponsContainer = document.getElementById('dungeonWeaponsList');
    if (!weaponsContainer) return;

    weaponsContainer.innerHTML = '';
    const weapons = getWeaponsByClass(classId);

    weapons.forEach((weaponName) => {
        const chip = document.createElement('span');
        chip.className = 'dungeon-weapon-chip px-2.5 py-1 text-xs font-bold';
        chip.textContent = `◆ ${weaponName}`;
        weaponsContainer.appendChild(chip);
    });
}

function renderProjectsSection(classId, language, dungeonTexts) {
    const projectsContainer = document.getElementById('dungeonProjectsGrid');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = '';
    const filteredProjects = filterItemsByClass(DUNGEON_PROJECTS, classId);

    filteredProjects.forEach((project) => {
        const card = document.createElement('article');
        card.className = 'dungeon-item-card p-3.5 flex flex-col justify-between';

        const topBlock = document.createElement('div');

        const headerRow = document.createElement('div');
        headerRow.className = 'flex items-start justify-between gap-2 mb-2';

        const title = document.createElement('h4');
        title.className = 'font-gothic-pixel text-[11px] text-bronze leading-snug';
        title.textContent = project.title[language];
        headerRow.appendChild(title);

        if (project.repoUrl) {
            const repoLink = document.createElement('a');
            repoLink.href = project.repoUrl;
            repoLink.target = '_blank';
            repoLink.rel = 'noopener noreferrer';
            repoLink.className = 'dungeon-inline-link font-gothic-pixel text-[8px] shrink-0';
            repoLink.textContent = dungeonTexts.repoLinkLabel;
            repoLink.addEventListener('click', () => playSound('click'));
            headerRow.appendChild(repoLink);
        }

        const desc = document.createElement('p');
        desc.className = 'text-xs text-[#D8E2EB]/90 leading-relaxed mb-3';
        desc.textContent = project.description[language];

        topBlock.appendChild(headerRow);
        topBlock.appendChild(desc);

        const stackRow = document.createElement('div');
        stackRow.className = 'flex flex-wrap gap-1.5 pt-2 border-t border-[#2B3138]';
        project.stack.forEach((tech) => {
            const badge = document.createElement('span');
            badge.className = 'px-2 py-0.5 text-[10px] font-bold bg-[#0D0D0F] border border-[#56616E] text-steel';
            badge.textContent = tech;
            stackRow.appendChild(badge);
        });

        card.appendChild(topBlock);
        card.appendChild(stackRow);
        projectsContainer.appendChild(card);
    });
}

function renderExperienceSection(classId, language) {
    const experienceContainer = document.getElementById('dungeonExperienceList');
    if (!experienceContainer) return;

    experienceContainer.innerHTML = '';
    const filteredExperience = filterItemsByClass(DUNGEON_EXPERIENCE, classId);

    filteredExperience.forEach((expItem) => {
        const card = document.createElement('article');
        card.className = 'dungeon-item-card p-3.5';

        const headerRow = document.createElement('div');
        headerRow.className = 'flex flex-wrap items-center justify-between gap-2 mb-1.5';

        const roleTitle = document.createElement('h4');
        roleTitle.className = 'font-gothic-pixel text-[11px] text-bronze';
        roleTitle.textContent = expItem.role[language];

        const periodBadge = document.createElement('span');
        periodBadge.className = 'text-[11px] font-bold px-2 py-0.5 bg-[#0D0D0F] border border-[#B92B92] text-[#D4957A]';
        periodBadge.textContent = expItem.period[language];

        headerRow.appendChild(roleTitle);
        headerRow.appendChild(periodBadge);

        const orgSubtitle = document.createElement('p');
        orgSubtitle.className = 'text-xs font-bold text-steel mb-1.5';
        orgSubtitle.textContent = expItem.organization;

        const description = document.createElement('p');
        description.className = 'text-xs text-[#D8E2EB]/90 leading-relaxed';
        description.textContent = expItem.description[language];

        card.appendChild(headerRow);
        card.appendChild(orgSubtitle);
        card.appendChild(description);
        experienceContainer.appendChild(card);
    });
}

function renderSealsSection(classId, language, dungeonTexts) {
    const sealsContainer = document.getElementById('dungeonSealsContainer');
    if (!sealsContainer) return;

    sealsContainer.innerHTML = '';

    // 1. FIUBA Engineering Card
    const fiubaCard = document.createElement('article');
    fiubaCard.className = 'dungeon-item-card p-3.5';

    const fiubaTitle = document.createElement('h4');
    fiubaTitle.className = 'font-gothic-pixel text-[11px] text-bronze mb-1';
    fiubaTitle.textContent = DUNGEON_EDUCATION.degree[language];

    const fiubaInst = document.createElement('p');
    fiubaInst.className = 'text-xs font-bold text-steel mb-2.5';
    fiubaInst.textContent = DUNGEON_EDUCATION.institution;

    const coursesLabel = document.createElement('p');
    coursesLabel.className = 'text-[11px] text-[#D4957A] font-bold mb-1.5';
    coursesLabel.textContent = dungeonTexts.fiubaCoursesLabel;

    const coursesWrap = document.createElement('div');
    coursesWrap.className = 'flex flex-wrap gap-1.5';
    const matchingCourses = filterItemsByClass(DUNGEON_EDUCATION.courses, classId);
    matchingCourses.forEach((course) => {
        const courseBadge = document.createElement('span');
        courseBadge.className = 'px-2 py-1 text-xs bg-[#0D0D0F] border border-[#56616E] text-[#D8E2EB]';
        courseBadge.textContent = `• ${course.name[language]}`;
        coursesWrap.appendChild(courseBadge);
    });

    fiubaCard.appendChild(fiubaTitle);
    fiubaCard.appendChild(fiubaInst);
    fiubaCard.appendChild(coursesLabel);
    fiubaCard.appendChild(coursesWrap);

    // 2. Boot.dev Certifications Card
    const bootdevCard = document.createElement('article');
    bootdevCard.className = 'dungeon-item-card p-3.5';

    const bootdevTitle = document.createElement('h4');
    bootdevTitle.className = 'font-gothic-pixel text-[11px] text-bronze mb-2.5';
    bootdevTitle.textContent = dungeonTexts.bootdevTitle;

    const certList = document.createElement('div');
    certList.className = 'space-y-2';
    const matchingCerts = filterItemsByClass(DUNGEON_CERTIFICATIONS, classId);

    matchingCerts.forEach((cert) => {
        const certRow = document.createElement('div');
        certRow.className = 'flex items-center justify-between gap-2 p-2 bg-[#0D0D0F] border border-[#56616E]';

        const certName = document.createElement('span');
        certName.className = 'text-xs font-bold text-steel';
        certName.textContent = `📜 ${cert.title[language]}`;
        certRow.appendChild(certName);

        if (cert.url && cert.url.trim() !== '') {
            const verifyLink = document.createElement('a');
            verifyLink.href = cert.url.trim();
            verifyLink.target = '_blank';
            verifyLink.rel = 'noopener noreferrer';
            verifyLink.className = 'dungeon-inline-link font-gothic-pixel text-[8px] shrink-0';
            verifyLink.textContent = dungeonTexts.certVerifyLabel;
            verifyLink.addEventListener('click', () => playSound('click'));
            certRow.appendChild(verifyLink);
        } else {
            const badge = document.createElement('span');
            badge.className = 'font-gothic-pixel text-[8px] text-[#B92B92] shrink-0';
            badge.textContent = dungeonTexts.certVerifiedBadge;
            certRow.appendChild(badge);
        }

        certList.appendChild(certRow);
    });

    bootdevCard.appendChild(bootdevTitle);
    bootdevCard.appendChild(certList);

    sealsContainer.appendChild(fiubaCard);
    sealsContainer.appendChild(bootdevCard);
}

function updateActiveTabButtons(classId) {
    document.querySelectorAll('[data-dungeon-tab]').forEach((tabButton) => {
        const tabClassId = tabButton.getAttribute('data-dungeon-tab');
        tabButton.classList.toggle('active', tabClassId === classId);
    });
}

function renderChamberContent(classId = activeChamberClassId) {
    activeChamberClassId = classId;
    const language = getCurrentLanguage();
    const dungeonTexts = getDungeonTexts(language);

    updateActiveTabButtons(classId);
    updateCvDownloadLink(language);
    renderChamberHeaderBanner(classId, language, dungeonTexts);
    renderWeaponsSection(classId);
    renderProjectsSection(classId, language, dungeonTexts);
    renderExperienceSection(classId, language);
    renderSealsSection(classId, language, dungeonTexts);
}

function switchDungeonInternalView(viewName) {
    currentDungeonView = viewName;
    const selectView = document.getElementById('dungeonSelectView');
    const chamberView = document.getElementById('dungeonChamberView');

    if (selectView) selectView.classList.toggle('hidden', viewName !== 'select');
    if (chamberView) chamberView.classList.toggle('hidden', viewName !== 'chamber');
}

export function enterDungeonChamber(classId = OMNISCIENT_CLASS_ID) {
    playSound('coin');
    renderChamberContent(classId);
    switchDungeonInternalView('chamber');

    const scrollArea = document.getElementById('dungeonScrollContainer');
    if (scrollArea) {
        scrollArea.scrollTop = 0;
    }
}

export function showDungeonClassSelect() {
    playSound('click');
    renderClassSelectCards();
    switchDungeonInternalView('select');
}

export function openDungeonModal(initialView = 'select', classId = OMNISCIENT_CLASS_ID) {
    const modalElement = getDungeonModal();
    if (!modalElement) return;

    modalElement.classList.remove('hidden');
    updateCvDownloadLink(getCurrentLanguage());
    renderClassSelectCards();

    if (initialView === 'chamber') {
        renderChamberContent(classId);
        switchDungeonInternalView('chamber');
    } else {
        switchDungeonInternalView('select');
    }
}

export function closeDungeonModal() {
    const modalElement = getDungeonModal();
    if (!modalElement) return;

    modalElement.classList.add('hidden');
    playSound('click');
}

export function refreshDungeonLanguage() {
    updateCvDownloadLink(getCurrentLanguage());
    renderClassSelectCards();
    renderChamberContent(activeChamberClassId);
}

function handleDungeonKeydown(event) {
    if (!isDungeonModalOpen()) return;

    if (event.key === 'Escape') {
        event.preventDefault();
        closeDungeonModal();
        return;
    }

    if (currentDungeonView !== 'select') return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        selectedCardIndex = (selectedCardIndex + 1) % DUNGEON_CLASSES.length;
        updateClassCardHighlight();
        playSound('starHover');
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        selectedCardIndex = (selectedCardIndex - 1 + DUNGEON_CLASSES.length) % DUNGEON_CLASSES.length;
        updateClassCardHighlight();
        playSound('starHover');
    } else if (event.key === 'Enter') {
        event.preventDefault();
        const chosenClass = DUNGEON_CLASSES[selectedCardIndex];
        if (chosenClass) {
            enterDungeonChamber(chosenClass.id);
        }
    }
}

export function initDungeonUI() {
    renderClassSelectCards();
    renderChamberContent(OMNISCIENT_CLASS_ID);

    const closeButton = document.getElementById('dungeonCloseBtn');
    const backToSelectButton = document.getElementById('dungeonBackToSelectBtn');
    const omniscientButton = document.getElementById('dungeonOmniscientBtn');
    const downloadCvButton = document.getElementById('dungeonDownloadCvBtn');

    if (closeButton) {
        closeButton.addEventListener('click', closeDungeonModal);
    }

    if (backToSelectButton) {
        backToSelectButton.addEventListener('click', showDungeonClassSelect);
    }

    if (omniscientButton) {
        omniscientButton.addEventListener('click', () => {
            enterDungeonChamber(OMNISCIENT_CLASS_ID);
        });
    }

    if (downloadCvButton) {
        downloadCvButton.addEventListener('click', () => {
            playSound('coin');
        });
    }

    document.querySelectorAll('[data-dungeon-tab]').forEach((tabButton) => {
        tabButton.addEventListener('click', () => {
            const targetClassId = tabButton.getAttribute('data-dungeon-tab');
            enterDungeonChamber(targetClassId);
        });
    });

    window.addEventListener('keydown', handleDungeonKeydown);
}
