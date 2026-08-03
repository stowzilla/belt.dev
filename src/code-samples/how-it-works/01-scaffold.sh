$ belt new my-app
✓ my-app created successfully!

$ cd my-app
$ belt generate resource item name:string status:string owner:string

  create  lambda/models/item.rb
  create  lambda/controllers/my_app/items_controller.rb
  update  config/routes.rb
  update  config/contracts.rb
  update  lambda/lib/routes/my_app_routes.rb

✓ Resource 'item' generated!
