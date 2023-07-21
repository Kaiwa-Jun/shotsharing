Rails.application.routes.draw do
  devise_for :users
  namespace :api do
    namespace :v1 do
      get 'hello', to: 'hello#index'
      resources :users, only: [:create, :update] do
        resources :likes, only: [:index], controller: 'likes'
        resources :comments, only: [:index], module: :users
      end
      get '/user_photos/:user_id', to: 'photos#user_photos'
      resources :photos, only: [:index, :create, :show, :update, :destroy] do
        resources :comments, only: [:index, :create]
        resource :likes, only: [:show, :create, :destroy]
        collection do
          get 'comments_count'
        end
      end
      get '/search', to: 'search#index'
    end
  end
end
