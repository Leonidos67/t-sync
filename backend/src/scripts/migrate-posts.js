const mongoose = require('mongoose');
require('dotenv').config();

// Подключение к базе данных
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aurora-rise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'authorType'
  },
  authorType: {
    type: String,
    enum: ['User', 'Club'],
    default: 'User'
  },
  text: { type: String, required: true },
  image: { type: String, default: null },
  location: { type: String, default: null },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  fires: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  wows: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const PostModel = mongoose.model("Post", postSchema);

async function migratePosts() {
  try {
    console.log('Начинаем миграцию постов...');
    
    // Находим все посты без authorType
    const postsWithoutAuthorType = await PostModel.find({ authorType: { $exists: false } });
    
    console.log(`Найдено ${postsWithoutAuthorType.length} постов без authorType`);
    
    // Обновляем все посты, устанавливая authorType = 'User'
    const result = await PostModel.updateMany(
      { authorType: { $exists: false } },
      { $set: { authorType: 'User' } }
    );
    
    console.log(`Обновлено ${result.modifiedCount} постов`);
    console.log('Миграция завершена успешно!');
    
  } catch (error) {
    console.error('Ошибка при миграции:', error);
  } finally {
    mongoose.connection.close();
  }
}

migratePosts();
