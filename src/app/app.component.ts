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
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 transition-all duration-300">
      <!-- Navigation Header -->
      <header class="bg-white/80 backdrop-blur-xl border-b border-blue-100/50 sticky top-0 z-50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-xl">🐦</span>
                </div>
                <h1 class="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TinyChirp</h1>
              </div>
            </div>
            
            <!-- Search Bar -->
            <div class="flex-1 max-w-lg mx-8">
              <div class="relative">
                <input type="text" 
                       placeholder="Search TinyChirp" 
                       class="w-full bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl py-3 pl-12 pr-4 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:outline-none shadow-sm transition-all duration-200">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Right side controls -->
            <div class="flex items-center space-x-2">
              <!-- Notifications -->
              <button class="relative p-3 rounded-xl hover:bg-blue-50/80 transition-all duration-200 group">
                <svg class="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5zm0 0V12a4 4 0 00-8 0v5"></path>
                </svg>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white"></span>
              </button>
              
              <!-- Messages -->
              <button class="p-3 rounded-xl hover:bg-blue-50/80 transition-all duration-200 group">
                <svg class="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </button>
              
              <!-- Theme toggle -->
              <button (click)="toggleTheme()" 
                      class="p-3 rounded-xl hover:bg-blue-50/80 transition-all duration-200 group">
                <svg *ngIf="!isDark" class="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                <svg *ngIf="isDark" class="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </button>
              
              <!-- Profile dropdown -->
              <div class="relative ml-2">
                <button class="flex items-center space-x-2 p-2 rounded-xl hover:bg-blue-50/80 transition-all duration-200 group">
                                  <div class="group cursor-pointer">
                  <img [src]="currentUserData.avatar" [alt]="currentUserData.name" class="w-10 h-10 rounded-xl border-2 border-blue-200 group-hover:border-blue-300 transition-colors shadow-sm object-cover">
                </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100/50 p-6 sticky top-24">
              <!-- User Profile Card -->
              <div class="text-center mb-6">
                <div class="relative inline-block mb-4">
                  <img [src]="currentUserData.avatar" [alt]="currentUserData.name" class="w-20 h-20 rounded-2xl mx-auto border-4 border-blue-200 shadow-lg object-cover">
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg border-3 border-white"></div>
                </div>
                <h3 class="font-bold text-slate-800 text-lg">{{currentUserData.name}}</h3>
                <p class="text-slate-500 mb-3">&#64;{{currentUserData.handle}}</p>
                <div class="flex justify-center space-x-6 text-sm">
                  <div class="text-center">
                    <div class="font-bold text-slate-700">{{currentUserData.following}}</div>
                    <div class="text-slate-500">Following</div>
                  </div>
                  <div class="text-center">
                    <div class="font-bold text-slate-700">{{currentUserData.followers}}</div>
                    <div class="text-slate-500">Followers</div>
                  </div>
                </div>
              </div>
              
              <!-- Navigation Menu -->
              <nav class="space-y-1">
                <a href="#" class="flex items-center space-x-3 text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl p-3 transition-all duration-200 font-medium">
                  <div class="p-1 rounded-lg bg-blue-100/50">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                  <span>Home</span>
                </a>
                <a href="#" class="flex items-center space-x-3 text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl p-3 transition-all duration-200 font-medium">
                  <div class="p-1 rounded-lg bg-blue-100/50">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <span>Profile</span>
                </a>
                <a href="#" class="flex items-center space-x-3 text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl p-3 transition-all duration-200 font-medium">
                  <div class="p-1 rounded-lg bg-blue-100/50">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                  </div>
                  <span>Bookmarks</span>
                </a>
                <a href="#" class="flex items-center space-x-3 text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl p-3 transition-all duration-200 font-medium">
                  <div class="p-1 rounded-lg bg-blue-100/50">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5zm0 0V12a4 4 0 00-8 0v5"></path>
                    </svg>
                  </div>
                  <span>Notifications</span>
                </a>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Compose Tweet -->
            <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100/50 p-6 mb-8">
              <div class="flex space-x-4">
                <img [src]="currentUserData.avatar" [alt]="currentUserData.name" class="w-14 h-14 rounded-2xl flex-shrink-0 border-2 border-blue-200 shadow-md object-cover">
                <div class="flex-1">
                  <textarea 
                    [(ngModel)]="newPostText"
                    placeholder="What's happening?"
                    class="w-full resize-none bg-transparent text-xl placeholder-slate-400 text-slate-700 border-0 focus:outline-none focus:ring-0 leading-relaxed"
                    rows="4"></textarea>
                  
                  <div class="flex items-center justify-between mt-6 pt-4 border-t border-blue-100">
                    <div class="flex items-center space-x-3">
                      <!-- Media buttons -->
                      <button class="text-blue-500 hover:bg-blue-50 p-2 rounded-xl transition-all duration-200 group">
                        <svg class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                      <button class="text-blue-500 hover:bg-blue-50 p-2 rounded-xl transition-all duration-200 group">
                        <svg class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"></path>
                        </svg>
                      </button>
                      <div class="flex items-center space-x-2 text-sm">
                        <span class="px-3 py-1 rounded-full {{ newPostText.length > 260 ? 'bg-red-100 text-red-600' : newPostText.length > 200 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600' }} font-medium">
                          {{ 280 - newPostText.length }}
                        </span>
                      </div>
                    </div>
                    <button 
                      (click)="createPost()"
                      [disabled]="!newPostText.trim() || newPostText.length > 280"
                      class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100">
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="space-y-6">
              <div *ngFor="let post of posts" class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-200/70">
                <div class="p-6">
                  <div class="flex space-x-4">
                    <img [src]="getUser(post.userId)?.avatar" [alt]="getUser(post.userId)?.name" class="w-14 h-14 rounded-2xl flex-shrink-0 border-2 border-blue-200 shadow-md object-cover">
                    <div class="flex-1 min-w-0">
                      <!-- Post Header -->
                      <div class="flex items-center space-x-2 mb-3">
                        <h3 class="font-bold text-slate-800 text-lg">{{getUser(post.userId)?.name}}</h3>
                        <span *ngIf="getUser(post.userId)?.verified" class="text-blue-500">
                          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                          </svg>
                        </span>
                        <span class="text-slate-500 font-medium">&#64;{{getUser(post.userId)?.handle}}</span>
                        <span class="text-slate-400">·</span>
                        <time class="text-slate-500 text-sm">{{getTimeAgo(post.createdAt)}}</time>
                        <div class="ml-auto">
                          <button *ngIf="post.userId === currentUser" class="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- Post Content -->
                      <div *ngIf="editingPostId === post.id" class="mb-6">
                        <textarea [(ngModel)]="editingText" 
                                  class="w-full p-4 border border-blue-200 rounded-2xl bg-blue-50/30 text-slate-700 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:outline-none transition-all duration-200" 
                                  rows="4"></textarea>
                        <div class="flex space-x-3 mt-4">
                          <button (click)="saveEdit(post.id)" 
                                  class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                            Save
                          </button>
                          <button (click)="cancelEdit()" 
                                  class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-6 py-2 rounded-xl text-sm transition-all duration-200">
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div *ngIf="editingPostId !== post.id" class="mb-6">
                        <p class="text-slate-700 text-lg leading-relaxed font-medium">{{post.text}}</p>
                        <img *ngIf="post.imageUrl" [src]="post.imageUrl" alt="Post image" class="mt-4 rounded-2xl max-w-full h-auto shadow-lg border border-blue-100">
                      </div>

                      <!-- Post Actions -->
                      <div class="flex items-center justify-between max-w-lg">
                        <button (click)="toggleReply(post.id)" 
                                class="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-all duration-200 group">
                          <div class="p-3 rounded-xl group-hover:bg-blue-50 transition-all duration-200 group-hover:scale-110">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                          </div>
                          <span class="text-sm font-medium">{{post.replies?.length || 0}}</span>
                        </button>

                        <button (click)="toggleRetweet(post.id)" 
                                [class.text-emerald-600]="isRetweeted(post)"
                                [class.text-slate-500]="!isRetweeted(post)"
                                class="flex items-center space-x-2 hover:text-emerald-600 transition-all duration-200 group">
                          <div class="p-3 rounded-xl group-hover:bg-emerald-50 transition-all duration-200 group-hover:scale-110">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                          </div>
                          <span class="text-sm font-medium">{{post.retweets?.length || 0}}</span>
                        </button>

                        <button (click)="toggleLike(post.id)" 
                                [class.text-pink-500]="isLiked(post)"
                                [class.text-slate-500]="!isLiked(post)"
                                class="flex items-center space-x-2 hover:text-pink-500 transition-all duration-200 group">
                          <div class="p-3 rounded-xl group-hover:bg-pink-50 transition-all duration-200 group-hover:scale-110">
                            <svg [class.fill-current]="isLiked(post)" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                          </div>
                          <span class="text-sm font-medium">{{post.likes?.length || 0}}</span>
                        </button>

                        <button class="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-all duration-200 group">
                          <div class="p-3 rounded-xl group-hover:bg-blue-50 transition-all duration-200 group-hover:scale-110">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                            </svg>
                          </div>
                        </button>

                        <div *ngIf="post.userId === currentUser" class="flex items-center space-x-1">
                          <button (click)="startEdit(post)" 
                                  class="p-3 text-slate-500 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-all duration-200 group">
                            <svg class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button (click)="deletePost(post.id)" 
                                  class="p-3 text-slate-500 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all duration-200 group">
                            <svg class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div class="space-y-8">
              <!-- Trending -->
              <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100/50 p-6">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mb-6">What's happening</h3>
                <div class="space-y-4">
                  <div *ngFor="let trend of trendingTopics" class="hover:bg-blue-50/80 p-4 rounded-xl transition-all duration-200 cursor-pointer group">
                    <p class="text-sm text-slate-500 font-medium mb-1">{{trend.category}}</p>
                    <p class="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{{trend.topic}}</p>
                    <p class="text-sm text-slate-500 mt-1">{{trend.tweets}} Tweets</p>
                  </div>
                </div>
              </div>

              <!-- Who to follow -->
              <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100/50 p-6">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mb-6">Who to follow</h3>
                <div class="space-y-5">
                  <div *ngFor="let suggestion of whoToFollow" class="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/80 transition-all duration-200">
                    <div class="flex items-center space-x-3">
                      <img [src]="suggestion.avatar" [alt]="suggestion.name" class="w-12 h-12 rounded-xl border-2 border-blue-200 shadow-md object-cover">
                      <div>
                        <p class="font-bold text-slate-800">{{suggestion.name}}</p>
                        <p class="text-sm text-slate-500">&#64;{{suggestion.handle}}</p>
                      </div>
                    </div>
                    <button class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
      handle: 'sarahj', 
      name: 'Sarah Johnson', 
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=ffffff&size=200&bold=true&format=png',
      verified: true,
      followers: 1234,
      following: 567
    },
    { 
      id: 2, 
      handle: 'mike_pilot', 
      name: 'Mike Rodriguez', 
      avatar: 'https://ui-avatars.com/api/?name=Mike+Rodriguez&background=1e40af&color=ffffff&size=200&bold=true&format=png',
      verified: false,
      followers: 856,
      following: 234
    },
    { 
      id: 3, 
      handle: 'techguru', 
      name: 'Alex Chen', 
      avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=2563eb&color=ffffff&size=200&bold=true&format=png',
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
      avatar: 'https://ui-avatars.com/api/?name=John+Developer&background=1d4ed8&color=ffffff&size=200&bold=true&format=png'
    },
    { 
      name: 'Maria Designer', 
      handle: 'mariadesign', 
      avatar: 'https://ui-avatars.com/api/?name=Maria+Designer&background=2563eb&color=ffffff&size=200&bold=true&format=png'
    },
    { 
      name: 'Tech News', 
      handle: 'technews', 
      avatar: 'https://ui-avatars.com/api/?name=Tech+News&background=3b82f6&color=ffffff&size=200&bold=true&format=png'
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
