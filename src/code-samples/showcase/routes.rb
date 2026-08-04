Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    resources :posts
    resources :comments
  end
end
