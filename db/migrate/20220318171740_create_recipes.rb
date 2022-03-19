class CreateRecipes < ActiveRecord::Migration[6.1]
  def change
    create_table :recipes do |t|
      t.string :name, null: false
      t.text :ingredients, null: false
      t.text :instruction, null: false
      t.string :image, default: 'https://res.cloudinary.com/de6puygvt/image/upload/v1643845598/samples/food/fish-vegetables.jpg'

      t.timestamps
    end
  end
end
