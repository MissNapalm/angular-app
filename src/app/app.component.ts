import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  id: number;
  userId: number;
  text: string;
  createdAt: number;
  likes: number[];
  retweets: number[];
  replies: number[];
  imageUrl?: string;
}

interface User {
  id: number;
  handle: string;
  name: string;
  avatar: string;
  verified?: boolean;
  followers: number;
  following: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Navigation Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 flex items-center">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-lg">🐦</span>
                </div>
                <h1 class="ml-3 text-xl font-bold text-gray-900 dark:text-white">TinyChirp</h1>
              </div>
            </div>
            
            <!-- Search Bar -->
            <div class="flex-1 max-w-lg mx-8">
              <div class="relative">
                <input type="text" 
                       placeholder="Search TinyChirp" 
                       class="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-full py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Right side controls -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5zm0 0V12a4 4 0 00-8 0v5"></path>
                </svg>
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- Messages -->
              <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </button>
              
              <!-- Theme toggle -->
              <button (click)="toggleTheme()" 
                      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg *ngIf="!isDark" class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                <svg *ngIf="isDark" class="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </button>
              
              <!-- Profile dropdown -->
              <div class="relative">
                <button class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <img [src]="currentUserData.avatar" [alt]="currentUserData.name" class="w-8 h-8 rounded-full">
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Left Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <!-- User Profile Card -->
              <div class="text-center mb-6">
                <img [src]="currentUserData.avatar" [alt]="currentUserData.name" class="w-16 h-16 rounded-full mx-auto mb-3">
                <h3 class="font-bold text-gray-900 dark:text-white">{{currentUserData.name}}</h3>
                <p class="text-gray-500 dark:text-gray-400">&#64;{{currentUserData.handle}}</p>
                <div class="flex justify-center space-x-4 mt-3 text-sm">
                  <span class="text-gray-600 dark:text-gray-300">
                    <strong>{{currentUserData.following}}</strong> Following
                  </span>
                  <span class="text-gray-600 dark:text-gray-300">
                    <strong>{{currentUserData.followers}}</strong> Followers
                  </span>
                </div>
              </div>
              
              <!-- Navigation Menu -->
              <nav class="space-y-2">
                <a href="#" class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span>Home</span>
                </a>
                <a href="#" class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Profile</span>
                </a>
                <a href="#" class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                  <span>Bookmarks</span>
                </a>
                <a href="#" class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5zm0 0V12a4 4 0 00-8 0v5"></path>
                  </svg>
                  <span>Notifications</span>
                </a>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Compose Tweet -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div class="flex space-x-4">
                <img [src]="currentUserData.avatar" [alt]="currentUserData.name" class="w-12 h-12 rounded-full flex-shrink-0">
                <div class="flex-1">
                  <textarea 
                    [(ngModel)]="newPostText"
                    placeholder="What's happening?"
                    class="w-full resize-none bg-transparent text-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white border-0 focus:outline-none focus:ring-0"
                    rows="3"></textarea>
                  
                  <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div class="flex items-center space-x-4">
                      <!-- Media buttons -->
                      <button class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                      <button class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"></path>
                        </svg>
                      </button>
                      <span class="text-sm text-gray-500 dark:text-gray-400">{{ 280 - newPostText.length }}</span>
                    </div>
                    <button 
                      (click)="createPost()"
                      [disabled]="!newPostText.trim() || newPostText.length > 280"
                      class="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-full transition-colors">
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="space-y-6">
              <div *ngFor="let post of posts" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div class="p-6">
                  <div class="flex space-x-3">
                    <img [src]="getUser(post.userId)?.avatar" [alt]="getUser(post.userId)?.name" class="w-12 h-12 rounded-full flex-shrink-0">
                    <div class="flex-1 min-w-0">
                      <!-- Post Header -->
                      <div class="flex items-center space-x-2 mb-2">
                        <h3 class="font-bold text-gray-900 dark:text-white">{{getUser(post.userId)?.name}}</h3>
                        <span *ngIf="getUser(post.userId)?.verified" class="text-blue-500">
                          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                          </svg>
                        </span>
                        <span class="text-gray-500 dark:text-gray-400">&#64;{{getUser(post.userId)?.handle}}</span>
                        <span class="text-gray-500 dark:text-gray-400">·</span>
                        <time class="text-gray-500 dark:text-gray-400 text-sm">{{getTimeAgo(post.createdAt)}}</time>
                        <div class="ml-auto">
                          <button *ngIf="post.userId === currentUser" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- Post Content -->
                      <div *ngIf="editingPostId === post.id" class="mb-4">
                        <textarea [(ngModel)]="editingText" 
                                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                  rows="3"></textarea>
                        <div class="flex space-x-2 mt-3">
                          <button (click)="saveEdit(post.id)" 
                                  class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-full text-sm transition-colors">
                            Save
                          </button>
                          <button (click)="cancelEdit()" 
                                  class="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-full text-sm transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div *ngIf="editingPostId !== post.id" class="mb-4">
                        <p class="text-gray-900 dark:text-white text-lg leading-relaxed">{{post.text}}</p>
                        <img *ngIf="post.imageUrl" [src]="post.imageUrl" alt="Post image" class="mt-3 rounded-2xl max-w-full h-auto">
                      </div>

                      <!-- Post Actions -->
                      <div class="flex items-center justify-between max-w-md">
                        <button (click)="toggleReply(post.id)" 
                                class="flex items-center space-x-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors group">
                          <div class="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                          </div>
                          <span class="text-sm">{{post.replies?.length || 0}}</span>
                        </button>

                        <button (click)="toggleRetweet(post.id)" 
                                [class.text-green-600]="isRetweeted(post)"
                                class="flex items-center space-x-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors group">
                          <div class="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                          </div>
                          <span class="text-sm">{{post.retweets?.length || 0}}</span>
                        </button>

                        <button (click)="toggleLike(post.id)" 
                                [class.text-red-600]="isLiked(post)"
                                class="flex items-center space-x-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors group">
                          <div class="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                            <svg [class.fill-current]="isLiked(post)" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                          </div>
                          <span class="text-sm">{{post.likes?.length || 0}}</span>
                        </button>

                        <button class="flex items-center space-x-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors group">
                          <div class="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                            </svg>
                          </div>
                        </button>

                        <div *ngIf="post.userId === currentUser" class="flex items-center space-x-1">
                          <button (click)="startEdit(post)" 
                                  class="p-2 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button (click)="deletePost(post.id)" 
                                  class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="lg:col-span-1">
            <div class="space-y-6">
              <!-- Trending -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">What's happening</h3>
                <div class="space-y-4">
                  <div *ngFor="let trend of trendingTopics" class="hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors cursor-pointer">
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{trend.category}}</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{trend.topic}}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{trend.tweets}} Tweets</p>
                  </div>
                </div>
              </div>

              <!-- Who to follow -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Who to follow</h3>
                <div class="space-y-4">
                  <div *ngFor="let suggestion of whoToFollow" class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <img [src]="suggestion.avatar" [alt]="suggestion.name" class="w-10 h-10 rounded-full">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{suggestion.name}}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">&#64;{{suggestion.handle}}</p>
                      </div>
                    </div>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-1 rounded-full text-sm transition-colors">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  currentUser = 1;
  users: User[] = [
    { 
      id: 1, 
      handle: 'sarah', 
      name: 'Sarah Clark', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SarahHappy&backgroundColor=ffd93d&accessories=eyepatch&accessoriesColor=262e33&accessoriesProbability=100&clothingGraphic=bat&eyes=happy&eyebrows=raised&mouth=smile&hair=long&hairColor=724133',
      verified: true,
      followers: 1234,
      following: 567
    },
    { 
      id: 2, 
      handle: 'ashley', 
      name: 'Ashley Moon', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ashley&backgroundColor=c0aede',
      verified: false,
      followers: 892,
      following: 234
    },
    { 
      id: 3, 
      handle: 'techguru', 
      name: 'Alex Chen', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex&backgroundColor=ffd93d',
      verified: true,
      followers: 5678,
      following: 123
    },
  ];
  
  posts: Post[] = [];
  newPostText = '';
  isDark = false;
  editingPostId: number | null = null;
  editingText = '';

  trendingTopics = [
    { category: 'Technology', topic: '#AI Revolution', tweets: '42.1K' },
    { category: 'Sports', topic: 'World Cup 2026', tweets: '128K' },
    { category: 'Entertainment', topic: '#NewMovie', tweets: '89.3K' },
    { category: 'Politics', topic: 'Climate Change', tweets: '234K' },
  ];

  whoToFollow = [
    { 
      name: 'John Developer', 
      handle: 'johndev', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=John&backgroundColor=ffdfbf'
    },
    { 
      name: 'Maria Designer', 
      handle: 'mariadesign', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Maria&backgroundColor=c0aede'
    },
    { 
      name: 'Tech News', 
      handle: 'technews', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Tech&backgroundColor=d1f2eb'
    },
  ];

  constructor() {
    const saved = localStorage.getItem('tinychirp_posts');
    this.posts = saved ? JSON.parse(saved) : [
      { 
        id: 101, 
        userId: 1, 
        text: 'Just shipped a new feature! The future of social media is here 🚀 #TechLife #Innovation', 
        createdAt: Date.now() - 3600000, 
        likes: [2, 3], 
        retweets: [2], 
        replies: [] 
      },
      { 
        id: 102, 
        userId: 2, 
        text: 'Beautiful sunset from the cockpit today. Flying never gets old ✈️ #Aviation #Pilot #SunsetViews', 
        createdAt: Date.now() - 180000, 
        likes: [1], 
        retweets: [], 
        replies: [] 
      },
      { 
        id: 103, 
        userId: 3, 
        text: 'The intersection of AI and human creativity is where magic happens. What are your thoughts on the future of AI-assisted design? 🤖✨', 
        createdAt: Date.now() - 7200000, 
        likes: [1, 2], 
        retweets: [1], 
        replies: [] 
      },
    ];
    
    // Load theme preference
    const savedTheme = localStorage.getItem('tinychirp_theme');
    this.isDark = savedTheme === 'dark';
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    }
  }

  get currentUserData() {
    return this.getUser(this.currentUser)!;
  }

  getUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  }

  createPost() {
    if (!this.newPostText.trim()) return;
    this.posts.unshift({
      id: Date.now(),
      userId: this.currentUser,
      text: this.newPostText,
      createdAt: Date.now(),
      likes: [],
      retweets: [],
      replies: []
    });
    localStorage.setItem('tinychirp_posts', JSON.stringify(this.posts));
    this.newPostText = '';
  }

  toggleLike(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    
    const idx = post.likes.indexOf(this.currentUser);
    if (idx > -1) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(this.currentUser);
    }
    localStorage.setItem('tinychirp_posts', JSON.stringify(this.posts));
  }

  toggleRetweet(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    
    const idx = post.retweets.indexOf(this.currentUser);
    if (idx > -1) {
      post.retweets.splice(idx, 1);
    } else {
      post.retweets.push(this.currentUser);
    }
    localStorage.setItem('tinychirp_posts', JSON.stringify(this.posts));
  }

  toggleReply(postId: number) {
    // Placeholder for reply functionality
    console.log('Reply to post:', postId);
  }

  isLiked(post: Post): boolean {
    return post.likes.includes(this.currentUser);
  }

  isRetweeted(post: Post): boolean {
    return post.retweets.includes(this.currentUser);
  }

  startEdit(post: Post) {
    this.editingPostId = post.id;
    this.editingText = post.text;
  }

  saveEdit(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.text = this.editingText;
      localStorage.setItem('tinychirp_posts', JSON.stringify(this.posts));
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingPostId = null;
    this.editingText = '';
  }

  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this tweet?')) {
      this.posts = this.posts.filter(p => p.id !== postId);
      localStorage.setItem('tinychirp_posts', JSON.stringify(this.posts));
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('tinychirp_theme', this.isDark ? 'dark' : 'light');
  }
}
