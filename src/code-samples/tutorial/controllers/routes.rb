Belt.application.routes.draw do
  namespace :api do
    resources :conversations, tables: [:conversations] do
      resources :messages, only: [:index], tables: [:messages]
    end

    post "/completions", action: :create,
                         controller: :completions,
                         tables: [:messages, :conversations]
  end
end
