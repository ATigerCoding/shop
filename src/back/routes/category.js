// src/back/routes/category.js
import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();


router.get('/list', async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find().populate('category', 'name');
    
    const topCategories = categories.filter(cat => !cat.pid);
    
    const treeData = topCategories.map(topCat => {
      const children = categories.filter(cat => cat.pid?.equals(topCat._id));
      
      const childrenWithProducts = children.map(child => {
        const childProducts = products.filter(prod => 
          prod.category._id.equals(child._id)
        );
        return {
          ...child.toObject(),
          products: childProducts
        };
      });
      
      return {
        ...topCat.toObject(),
        children: childrenWithProducts
      };
    });
    
    res.json(treeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 初始化数据
router.post('/init', async (req, res) => {
  try {

    // 创建一级分类
    const cat1 = await Category.insertOne({ name: '推荐分类' });
    const cat2 = await Category.insertOne({ name: '母婴玩具' });
    const cat3 = await Category.insertOne({ name: '数码家电' });
    const cat4 = await Category.insertOne({ name: '营养保健' });
    const cat5 = await Category.insertOne({ name: '服饰奢品' });
    const cat6 = await Category.insertOne({ name: '家居日用' });
    
    // 创建二级分类
    const subCat1 = await Category.insertOne({ name: '配件1', pid: cat1._id, level: 2 });
    const subCat2 = await Category.insertOne({ name: '笔记本', pid: cat3._id, level: 2 });
    const subCat3 = await Category.insertOne({ name: '电脑周边', pid: cat3._id, level: 2 });
    const subCat4 = await Category.insertOne({ name: '配件1', pid: cat2._id, level: 2 });
    const subCat5 = await Category.insertOne({ name: '营养保健', pid: cat4._id, level: 2 });
    const subCat6 = await Category.insertOne({ name: '钟表', pid: cat5._id, level: 2 });
    const subCat7 = await Category.insertOne({ name: '书籍类', pid: cat6._id, level: 2 });
    const subCat8 = await Category.insertOne({ name: '数码相机', pid: cat3._id, level: 2 });
    const subCat9 = await Category.insertOne({ name: 'T恤', pid: cat5._id, level: 2 });
    const subCat10 = await Category.insertOne({ name: '食品', pid: cat4._id, level: 2 });
    const subCat11 = await Category.insertOne({ name: '裤子', pid: cat5._id, level: 2 });
    const subCat12 = await Category.insertOne({ name: '书籍类', pid: cat6._id, level: 2 });
    const subCat13 = await Category.insertOne({ name: '配件1', pid: cat6._id, level: 2 });
    
    // 创建商品
    const products = [
      { name: '无线耳机', picture: '1', category: subCat1._id },
      { name: '充电宝', picture: '2', category: subCat1._id },
      { name: '手机壳', picture: '3', category: subCat1._id },
      { name: '游戏本', picture: '4', category: subCat2._id },
      { name: '轻薄本', picture: '5', category: subCat2._id },
      { name: '商务本', picture: '6', category: subCat2._id },
      { name: '机械键盘', picture: '7', category: subCat3._id },
      { name: '游戏鼠标', picture: '8', category: subCat3._id },
      { name: '显示器', picture: '9', category: subCat3._id },
      { name: '婴儿车', picture: '10', category: subCat4._id },
      { name: '积木玩具', picture: '11', category: subCat4._id },
      { name: '奶瓶', picture: '12', category: subCat4._id },
    ];
    
    await Product.insertMany(products);
    
    res.json({ message: '数据初始化成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;