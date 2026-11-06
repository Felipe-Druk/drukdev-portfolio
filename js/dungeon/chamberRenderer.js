/**************************************************************
 * DUNGEON CHAMBER DOM RENDERER (WEAPONS, RELICS, CHRONICLES & SEALS)
 **************************************************************/

import {
    DUNGEON_CLASSES,
    DUNGEON_EXPERIENCE,
    DUNGEON_PROJECTS,
    DUNGEON_EDUCATION,
    DUNGEON_CERTIFICATIONS,
    filterItemsByClass,
    getWeaponsByClass
} from '../config/dungeonData.js';
import { playSound } from '../audio/index.js';

export function renderChamberHeaderBanner(classId, language, dungeonTexts) {
    const bannerContainer = document.getElementById('dungeonChamberBanner');
    if (!bannerContainer) return;

    bannerContainer.innerHTML = '';
    const activeClass = DUNGEON_CLASSES.find((rpgClass) => rpgClass.id === classId);

    const titleElement = document.createElement('h3');
    titleElement.className = 'font-gothic-pixel text-xs sm:text-sm text-bronze';
    titleElement.textContent = activeClass
        ? `${activeClass.code} // ${activeClass.name[language]} — ${activeClass.role[language]}`
        : dungeonTexts.omniscientBannerTitle;

    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'text-xs text-steel mt-1';
    descriptionElement.textContent = activeClass
        ? activeClass.summary[language]
        : dungeonTexts.omniscientBannerDesc;

    bannerContainer.appendChild(titleElement);
    bannerContainer.appendChild(descriptionElement);
}

export function renderWeaponsSection(classId) {
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

function createProjectRelicCard(project, language, dungeonTexts) {
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

    const description = document.createElement('p');
    description.className = 'text-xs text-[#D8E2EB]/90 leading-relaxed mb-3';
    description.textContent = project.description[language];

    topBlock.appendChild(headerRow);
    topBlock.appendChild(description);

    const stackRow = document.createElement('div');
    stackRow.className = 'flex flex-wrap gap-1.5 pt-2 border-t border-[#2B3138]';
    project.stack.forEach((technologyName) => {
        const badge = document.createElement('span');
        badge.className = 'px-2 py-0.5 text-[10px] font-bold bg-[#0D0D0F] border border-[#56616E] text-steel';
        badge.textContent = technologyName;
        stackRow.appendChild(badge);
    });

    card.appendChild(topBlock);
    card.appendChild(stackRow);
    return card;
}

export function renderProjectsSection(classId, language, dungeonTexts) {
    const projectsContainer = document.getElementById('dungeonProjectsGrid');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = '';
    const filteredProjects = filterItemsByClass(DUNGEON_PROJECTS, classId);

    filteredProjects.forEach((project) => {
        projectsContainer.appendChild(createProjectRelicCard(project, language, dungeonTexts));
    });
}

function createExperienceChronicleCard(experienceItem, language) {
    const card = document.createElement('article');
    card.className = 'dungeon-item-card p-3.5';

    const headerRow = document.createElement('div');
    headerRow.className = 'flex flex-wrap items-center justify-between gap-2 mb-1.5';

    const roleTitle = document.createElement('h4');
    roleTitle.className = 'font-gothic-pixel text-[11px] text-bronze';
    roleTitle.textContent = experienceItem.role[language];

    const periodBadge = document.createElement('span');
    periodBadge.className = 'text-[11px] font-bold px-2 py-0.5 bg-[#0D0D0F] border border-[#B92B92] text-[#D4957A]';
    periodBadge.textContent = experienceItem.period[language];

    headerRow.appendChild(roleTitle);
    headerRow.appendChild(periodBadge);

    const organizationSubtitle = document.createElement('p');
    organizationSubtitle.className = 'text-xs font-bold text-steel mb-1.5';
    organizationSubtitle.textContent = experienceItem.organization;

    const description = document.createElement('p');
    description.className = 'text-xs text-[#D8E2EB]/90 leading-relaxed';
    description.textContent = experienceItem.description[language];

    card.appendChild(headerRow);
    card.appendChild(organizationSubtitle);
    card.appendChild(description);
    return card;
}

export function renderExperienceSection(classId, language) {
    const experienceContainer = document.getElementById('dungeonExperienceList');
    if (!experienceContainer) return;

    experienceContainer.innerHTML = '';
    const filteredExperience = filterItemsByClass(DUNGEON_EXPERIENCE, classId);

    filteredExperience.forEach((experienceItem) => {
        experienceContainer.appendChild(createExperienceChronicleCard(experienceItem, language));
    });
}

function createFiubaEducationCard(classId, language, dungeonTexts) {
    const fiubaCard = document.createElement('article');
    fiubaCard.className = 'dungeon-item-card p-3.5';

    const fiubaTitle = document.createElement('h4');
    fiubaTitle.className = 'font-gothic-pixel text-[11px] text-bronze mb-1';
    fiubaTitle.textContent = DUNGEON_EDUCATION.degree[language];

    const fiubaInstitution = document.createElement('p');
    fiubaInstitution.className = 'text-xs font-bold text-steel mb-2.5';
    fiubaInstitution.textContent = DUNGEON_EDUCATION.institution;

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
    fiubaCard.appendChild(fiubaInstitution);
    fiubaCard.appendChild(coursesLabel);
    fiubaCard.appendChild(coursesWrap);
    return fiubaCard;
}

function createBootdevSealsCard(classId, language, dungeonTexts) {
    const bootdevCard = document.createElement('article');
    bootdevCard.className = 'dungeon-item-card p-3.5';

    const bootdevTitle = document.createElement('h4');
    bootdevTitle.className = 'font-gothic-pixel text-[11px] text-bronze mb-2.5';
    bootdevTitle.textContent = dungeonTexts.bootdevTitle;

    const certList = document.createElement('div');
    certList.className = 'space-y-2';
    const matchingCerts = filterItemsByClass(DUNGEON_CERTIFICATIONS, classId);

    matchingCerts.forEach((certificate) => {
        const certRow = document.createElement('div');
        certRow.className = 'flex items-center justify-between gap-2 p-2 bg-[#0D0D0F] border border-[#56616E]';

        const certName = document.createElement('span');
        certName.className = 'text-xs font-bold text-steel';
        certName.textContent = `[+] ${certificate.title[language]}`;
        certRow.appendChild(certName);

        if (certificate.url && certificate.url.trim() !== '') {
            const verifyLink = document.createElement('a');
            verifyLink.href = certificate.url.trim();
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
    return bootdevCard;
}

export function renderSealsSection(classId, language, dungeonTexts) {
    const sealsContainer = document.getElementById('dungeonSealsContainer');
    if (!sealsContainer) return;

    sealsContainer.innerHTML = '';
    sealsContainer.appendChild(createFiubaEducationCard(classId, language, dungeonTexts));
    sealsContainer.appendChild(createBootdevSealsCard(classId, language, dungeonTexts));
}

export function renderChamberViewContent(classId, language, dungeonTexts) {
    renderChamberHeaderBanner(classId, language, dungeonTexts);
    renderWeaponsSection(classId);
    renderProjectsSection(classId, language, dungeonTexts);
    renderExperienceSection(classId, language);
    renderSealsSection(classId, language, dungeonTexts);
}
