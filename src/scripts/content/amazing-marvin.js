'use strict';

const titleElementClassId = '_17n7RKYrt-SlXX0V1Knv49';
const hoverButtonsContainerId = '_2SYo_FEWZYB9c-IM_6XJO7';
const projContainerClassId = '_3EenhmTvpkLi4AUdT7a_-_';

// Add toggl button for Amazing Marvin tasks
togglbutton.render('.Task:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = createTag('a', 'taskItem-toggl');

  // Find title of current task
  const titleElem = $('.' + titleElementClassId, elem);

  // A bit hacky - find project name
  const projectContainingElem = $('.sens', elem);
  const amazingMarvinFolderName = extractTextFromFolderElement(projectContainingElem);
  const amazingMarvinProjectText = getProjectText(elem);

  const link = togglbutton.createTimerLink({
    className: 'amazing-marvin-task',
    buttonType: 'minimal',
    description: titleElem.textContent.replace('\n', ' - ') + amazingMarvinProjectText,
    projectName: amazingMarvinFolderName + ' - General' // Doesn't work
  });

  container.appendChild(link);
  // Place the button in the element containing the hover buttons
  const hoverButtonsElem = $('.' + hoverButtonsContainerId, elem);
  hoverButtonsElem.insertBefore(container, hoverButtonsElem.firstChild);
});

// Add toggl button for Amazing Marvin projects
togglbutton.render('.' + projContainerClassId + ':not(.toggl)', { observe: true }, function (
  elem
) {
  const container = createTag('a', 'projectItem-toggl');

  // Find title of current task
  const titleElem = $('.' + titleElementClassId, elem);

  // A bit hacky - find project name
  const projectContainingElem = $('.sens', elem);
  const amazingMarvinFolderName = extractTextFromFolderElement(projectContainingElem);

  const link = togglbutton.createTimerLink({
    className: 'amazing-marvin-project',
    buttonType: 'minimal',
    description: titleElem.textContent.replace('\n', ' - '),
    projectName: amazingMarvinFolderName + ' - General' // Doesn't work
  });

  container.appendChild(link);
  // Place the button in the element containing the hover buttons
  const hoverButtonsElem = $('.' + hoverButtonsContainerId, elem);
  hoverButtonsElem.insertBefore(container, hoverButtonsElem.firstChild);
});

// Add toggl button for Amazing Marvin subtasks
togglbutton.render('.Subtask:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = createTag('a', 'projectItem-toggl');

  // Find title of current task
  const titleElem = $('.' + titleElementClassId, elem);

  const amazingMarvinParemtTaskName = getParentTaskText(elem);

  const link = togglbutton.createTimerLink({
    className: 'amazing-marvin-subtask',
    buttonType: 'minimal',
    description: titleElem.textContent.replace('\n', ' - ') + amazingMarvinParemtTaskName,
    projectName: amazingMarvinParemtTaskName // Doesn't work
  });

  container.appendChild(link);
  // Place the button in the element containing the hover buttons
  const subtaskButtonsElem = $('.SubtaskButtons', elem);
  subtaskButtonsElem.insertBefore(container, subtaskButtonsElem.firstChild);
});

function extractTextFromFolderElement (projectContainingElem) {
  // Given a task/project, extract the topmost folder of the task from the hover text
  if (projectContainingElem === null) {
    return '';
  }
  const longText = projectContainingElem.getAttribute('data-lhover3') ||
   projectContainingElem.getAttribute('data-hov');
  const seperator = ' ' + String.fromCharCode(0x203a);
  return longText.split(seperator)[0];
}

function getProjectText (elem) {
  // Given a task, get the text description of the parent project
  const maybeProjectContainer = elem.parentElement.parentElement.parentElement.parentElement;

  if (maybeProjectContainer.className.includes(projContainerClassId)) {
    const projectName = $('.' + titleElementClassId, maybeProjectContainer);
    return ' | ' + projectName.textContent;
  } else {
    return '';
  }
}

function getParentTaskText (elem) {
  // Given a subtask, tet the text description of the parent task
  const maybeParentTaskContainer = elem.parentElement.parentElement.parentElement.parentElement;

  if (maybeParentTaskContainer.className.includes('Task')) {
    const taskElem = $('.' + titleElementClassId, maybeParentTaskContainer);
    return ' | ' + taskElem.textContent;
  } else {
    return '';
  }
}
