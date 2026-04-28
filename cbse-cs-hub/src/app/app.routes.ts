import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'study-notes',
    loadComponent: () => import('./features/study-notes/chapter-list/chapter-list').then(m => m.ChapterList),
  },
  {
    path: 'study-notes/:chapterId',
    loadComponent: () => import('./features/study-notes/chapter-viewer/chapter-viewer').then(m => m.ChapterViewer),
  },
  {
    path: 'notes',
    loadComponent: () => import('./features/notes/notes').then(m => m.Notes),
  },
  {
    path: 'sql',
    loadComponent: () => import('./features/sql-practice/category-list/category-list').then(m => m.SqlCategoryList),
  },
  {
    path: 'sql/:category',
    loadComponent: () => import('./features/sql-practice/question-list/question-list').then(m => m.SqlQuestionList),
  },
  {
    path: 'python',
    loadComponent: () => import('./features/python-practice/topic-list/topic-list').then(m => m.PythonTopicList),
  },
  {
    path: 'python/:topic',
    loadComponent: () => import('./features/python-practice/exercise-list/exercise-list').then(m => m.PythonExerciseList),
  },
  {
    path: 'bookmarks',
    loadComponent: () => import('./features/bookmarks/bookmarks').then(m => m.Bookmarks),
  },
  {
    path: 'progress',
    loadComponent: () => import('./features/progress/progress').then(m => m.Progress),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search-results/search-results').then(m => m.SearchResults),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

