class PostsController < BeltController::Base
  before_action :authenticate!

  def index
    posts = Post.where(user_id: current_user_id)
    success_response(posts.map(&:attributes))
  end

  def create
    attrs = params.require(:post).permit(:title, :body)
    post = Post.create!(attrs.merge(user_id: current_user_id))
    success_response(post.attributes, 201)
  end
end
