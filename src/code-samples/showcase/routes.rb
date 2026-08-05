Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    resources :conversations do
      resources :messages, only: [:index, :create]
    end
  end
end
