Belt.application.routes.draw do
  gateway :api, auth: :cognito do                     # Creates an API Gateway
    resources :conversations do
      resources :messages, only: [:index, :create]
    end
  end
end
