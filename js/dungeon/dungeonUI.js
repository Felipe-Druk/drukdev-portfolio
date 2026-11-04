/**************************************************************
 * INTERACTIVE DUNGEON UI CONTROLLER — MODAL, NAVIGATION & STATE
 **************************************************************/

import { OMNISCIENT_CLASS_ID, DUNGEON_CLASSES } from '../config/dungeonData.js';
import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { getLocalizedCvPath } from '../config/links.js';
import { paintClassEmblemOnCanvas } from '../graphics/sprites/index.js';
import { playSound } from '../audio/soundEngine.js';
import { renderChamberViewContent } from './chamberRenderer.js';

const EMBLEM_CANVAS_SIZE = 48;
const MAX_STAT_VALUE = 100;

let currentDungeonView = 'select';
let selectedCardIndex = 0;
let activeChamberClassId = OMNISCIENT_CLASS_ID;
let dungeonModalOpen = false;

function getDungeonModal() {
    return document.getElementById('dungeonModal');
}

export function isDungeonModalOpen() {
    return dungeonModalOpen;
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

function paintAllClassCardEmblems() {
    DUNGEON_CLASSES.forEach((rpgClass) => {
        const canvasElement = document.getElementById(`dungeonClassSprite-${rpgClass.id}`);
        paintClassEmblemOnCanvas(canvasElement, rpgClass.emblemId);
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
    valueSpan.textContent = `${stat.value}/${MAX_STAT_VALUE}`;

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

function createClassSelectCard(rpgClass, cardIndex, language, dungeonTexts) {
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
    spriteCanvas.width = EMBLEM_CANVAS_SIZE;
    spriteCanvas.height = EMBLEM_CANVAS_SIZE;
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

    return card;
}

function renderClassSelectCards() {
    const gridContainer = document.getElementById('dungeonClassGrid');
    if (!gridContainer) return;

    const language = getCurrentLanguage();
    const dungeonTexts = getDungeonTexts(language);
    gridContainer.innerHTML = '';

    DUNGEON_CLASSES.forEach((rpgClass, cardIndex) => {
        gridContainer.appendChild(createClassSelectCard(rpgClass, cardIndex, language, dungeonTexts));
    });

    paintAllClassCardEmblems();
    updateClassCardHighlight();
}

function updateActiveTabButtons(classId) {
    document.querySelectorAll('[data-dungeon-tab]').forEach((tabButton) => {
        const tabClassId = tabButton.getAttribute('data-dungeon-tab');
        tabButton.classList.toggle('active', tabClassId === classId);
    });
}

function syncChamberStateAndRender(classId = activeChamberClassId) {
    activeChamberClassId = classId;
    const language = getCurrentLanguage();
    const dungeonTexts = getDungeonTexts(language);

    updateActiveTabButtons(classId);
    updateCvDownloadLink(language);
    renderChamberViewContent(classId, language, dungeonTexts);
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
    syncChamberStateAndRender(classId);
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

    dungeonModalOpen = true;
    modalElement.classList.remove('hidden');
    updateCvDownloadLink(getCurrentLanguage());
    renderClassSelectCards();

    if (initialView === 'chamber') {
        syncChamberStateAndRender(classId);
        switchDungeonInternalView('chamber');
    } else {
        switchDungeonInternalView('select');
    }
}

export function closeDungeonModal() {
    const modalElement = getDungeonModal();
    if (!modalElement) return;

    dungeonModalOpen = false;
    modalElement.classList.add('hidden');
    playSound('click');
}

export function refreshDungeonLanguage() {
    updateCvDownloadLink(getCurrentLanguage());
    renderClassSelectCards();
    syncChamberStateAndRender(activeChamberClassId);
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
    syncChamberStateAndRender(OMNISCIENT_CLASS_ID);

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

    const modalElement = getDungeonModal();
    if (modalElement) {
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) {
                closeDungeonModal();
            }
        });
    }

    window.addEventListener('keydown', handleDungeonKeydown);
}
