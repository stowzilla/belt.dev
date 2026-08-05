Belt.application.routes.draw do
  gateway :api do
    resources :conversations do
      resources :messages, only: [:index, :create]
    end
  end
end
