<template>
  <div class="category-container">
    <div class="menu">
      <!-- 左侧一级分类 -->
      <div class="menu-left">
        <ul>
          <li v-for="(menu, index) in menus" 
              :key="menu._id"
              :class="{ current: index === currentIndex }"
              @click="clickList(index)">
            <!-- 添加图标占位 -->
            <div class="icon-placeholder"></div>
            <p class="text">{{ menu.name }}</p>
          </li>
        </ul>
      </div>
      
      <!-- 右侧内容 -->
      <div class="menu-right" ref="itemList">
        <ul>
          <li v-for="menu in menus" :key="menu._id" class="cate">
            <h4 class="cate-title">{{ menu.name }}</h4>
            
            <!-- 二级分类横向滚动区域 -->
            <div class="sub-categories-scroll">
              <div v-for="subCat in menu.children" :key="subCat._id" class="sub-category-item">
                <div class="sub-category-title">{{ subCat.name }}</div>
                
                <!-- 商品网格 -->
                <div class="products-grid">
                  <div v-for="product in subCat.products" 
                       :key="product._id" 
                       class="product-item">
                    <img :src="'https://placekitten.com/60/60?image=' + product.picture" alt="商品图片">
                    <span>{{ product.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { getCategory } from '../api';
import BScroll from '@better-scroll/core';

const menus = ref([]);
const itemList = ref(null);
const rightLiTops = ref([]);
const scrollY = ref(0);
const currentIndex = ref(0);

onMounted(async () => {
  await loadCategoryList();
  nextTick(() => {
    initRightHeight();
    initBScroll();
  });
});

const loadCategoryList = async () => {
  try {
    const response = await getCategory();
    menus.value = response.data;
  } catch (error) {
    console.error('加载分类数据失败:', error);
  }
};

const clickList = (index) => {
  currentIndex.value = index;
  rightBscroll.scrollToElement(itemList.value.children[0].children[index], 300);
};

let rightBscroll = null;

const initBScroll = () => {
  rightBscroll = new BScroll('.menu-right', {
    click: true,
    probeType: 3
  });
  
  rightBscroll.on('scroll', (pos) => {
    scrollY.value = Math.abs(pos.y);
    updateCurrentIndex();
  });
};

const initRightHeight = () => {
  if (!itemList.value) return;
  
  const tops = [];
  let top = 0;
  tops.push(top);
  
  const items = itemList.value.querySelectorAll('.cate');
  items.forEach(item => {
    top += item.offsetHeight;
    tops.push(top);
  });
  
  rightLiTops.value = tops;
};

const updateCurrentIndex = () => {
  const y = scrollY.value;
  for (let i = 0; i < rightLiTops.value.length - 1; i++) {
    if (y >= rightLiTops.value[i] && y < rightLiTops.value[i + 1]) {
      currentIndex.value = i;
      return;
    }
  }
};
</script>

<style scoped>
.category-container {
  height: calc(100vh - 96px);
  background: #fff;
}

.menu {
  display: flex;
  height: 100%;
}

.menu-left {
  flex: 0 0 80px;
  background: #f8f8f8;
  overflow-y: auto;
}

.menu-left ul {
  padding: 0;
  margin: 0;
}

.menu-left li {
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  position: relative;
  cursor: pointer;
}

.menu-left li.current {
  background: #fff;
  color: #e4393c;
  font-weight: bold;
}

.menu-left li.current::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #e4393c;
}

.icon-placeholder {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #eee;
  margin-bottom: 5px;
}

.menu-right {
  flex: 1;
  padding: 10px;
  overflow: hidden;
}

.cate {
  margin-bottom: 20px;
}

.cate-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 8px;
  border-left: 3px solid #e4393c;
}

/* 二级分类横向滚动区域 */
.sub-categories-scroll {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 15px;
  -webkit-overflow-scrolling: touch;
}

.sub-categories-scroll::-webkit-scrollbar {
  display: none;
}

.sub-category-item {
  flex: 0 0 auto;
  width: 140px;
  margin-right: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.sub-category-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.product-item {
  text-align: center;
  padding: 5px 0;
}

.product-item img {
  width: 40px;
  height: 40px;
  display: block;
  margin: 0 auto 3px;
  border-radius: 4px;
}

.product-item span {
  font-size: 10px;
  color: #666;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>