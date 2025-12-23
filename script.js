// 检测营业状态
function checkBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const statusElement = document.getElementById('status');
    
    if (hour >= 6 && hour < 21) {
        statusElement.innerHTML = '🟢 正在营业中';
        statusElement.style.color = '#27ae60';
    } else {
        statusElement.innerHTML = '🔴 已打烊，明日06:00开门';
        statusElement.style.color = '#e74c3c';
    }
}

// 获取当前时间并显示
function updateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('zh-CN', options);
}

// 添加时间显示到页脚
function addTimeToFooter() {
    const footer = document.querySelector('footer .container');
    const timeElement = document.createElement('p');
    timeElement.className = 'current-time';
    timeElement.style.fontSize = '14px';
    timeElement.style.color = '#95a5a6';
    timeElement.style.marginTop = '10px';
    timeElement.textContent = '当前时间：' + updateTime();
    
    footer.appendChild(timeElement);
}

// 商品库存状态（模拟）
function updateStockStatus() {
    const stockData = {
        '上海青': '充足',
        '五花肉': '充足',
        '宫保鸡丁套餐': '充足',
        '西红柿': '充足',
        '鸡腿肉': '充足'
    };
    
    // 为价格添加库存提示
    const prices = document.querySelectorAll('.price');
    prices.forEach(price => {
        const product = price.parentElement.textContent.split(' ')[0];
        if (stockData[product]) {
            const stockSpan = document.createElement('span');
            stockSpan.className = 'stock';
            stockSpan.textContent = '库存：' + stockData[product];
            stockSpan.style.cssText = `
                display: block;
                font-size: 12px;
                color: ${stockData[product] === '充足' ? '#27ae60' : '#e74c3c'};
                margin-top: 5px;
            `;
            price.parentElement.appendChild(stockSpan);
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检测营业状态
    checkBusinessHours();
    
    // 每5分钟更新一次营业状态
    setInterval(checkBusinessHours, 300000);
    
    // 添加当前时间
    addTimeToFooter();
    
    // 每1分钟更新时间
    setInterval(() => {
        document.querySelector('.current-time').textContent = '当前时间：' + updateTime();
    }, 60000);
    
    // 更新库存状态
    updateStockStatus();
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 添加晚间清仓倒计时
    function updateClearanceCountdown() {
        const now = new Date();
        const clearanceTime = new Date();
        clearanceTime.setHours(19, 0, 0, 0);
        
        if (now.getHours() >= 19) {
            clearanceTime.setDate(clearanceTime.getDate() + 1);
        }
        
        const diff = clearanceTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        const clearanceElement = document.querySelector('.clearance p');
        if (clearanceElement) {
            if (hours > 0 || minutes > 0) {
                clearanceElement.innerHTML = `距离晚间清仓还有：<strong>${hours}小时${minutes}分钟</strong>`;
            } else {
                clearanceElement.innerHTML = '🎉 晚间清仓特惠进行中！';
            }
        }
    }
    
    // 初始化和定时更新
    updateClearanceCountdown();
    setInterval(updateClearanceCountdown, 60000);
});
