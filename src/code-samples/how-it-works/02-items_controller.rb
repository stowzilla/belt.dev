class MyAppControllers::ItemsController < ApplicationController
  def index
    items = Item.where(owner: current_user_id)
    success_response(items: items.map(&:to_h))
  end

  def create
    item = Item.create!(
      name: params[:name],
      status: 'active',
      owner: current_user_id
    )
    success_response(item: item.to_h, status: 201)
  end
end
