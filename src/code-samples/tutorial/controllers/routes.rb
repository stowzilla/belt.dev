Belt.application.routes.draw do
  namespace :api do
    resources :conversations, tables: [:conversations]
    resources :messages, tables: [:messages]

    post "/completions", action: :create,
                         controller: :completions,
                         tables: [:messages, :conversations]
  end
end
