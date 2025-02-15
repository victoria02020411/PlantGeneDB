// 配置参数
const config = {
  itemsPerPage: 10,
  currentPage: 1
};

// 示例数据 - 实际使用时替换为真实数据
const geneData = [
  {
      geneId: 'MsG0180000001.01',
      chromosome: 'Chr1',
      startPosition: '146833',
      endPosition: '150094',
      strand: '+'
  },
  // ... 更多数据
];

// 初始化表格
function initializeTable() {
  // 添加列选择事件监听
  document.querySelectorAll('.column-toggles input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', updateTableVisibility);
  });

  // 添加搜索功能
  document.getElementById('searchInput').addEventListener('input', handleSearch);

  // 初始渲染表格
  renderTable(geneData);
  setupPagination();
}

// 搜索处理
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredData = geneData.filter(item => 
      Object.values(item).some(value => 
          value.toLowerCase().includes(searchTerm)
      )
  );
  config.currentPage = 1;
  renderTable(filteredData);
  setupPagination(filteredData);
}

// 更新表格列显示
function updateTableVisibility() {
  const tableHeaders = document.querySelectorAll('table th');
  const tableCells = document.querySelectorAll('table td');
  
  document.querySelectorAll('.column-toggles input[type="checkbox"]').forEach((checkbox, index) => {
      if (tableHeaders[index]) {
          tableHeaders[index].style.display = checkbox.checked ? '' : 'none';
      }
      tableCells.forEach((cell, cellIndex) => {
          if (cellIndex % tableHeaders.length === index) {
              cell.style.display = checkbox.checked ? '' : 'none';
          }
      });
  });
}

// 渲染表格数据
function renderTable(data) {
  const tbody = document.getElementById('geneTableBody');
  const start = (config.currentPage - 1) * config.itemsPerPage;
  const end = start + config.itemsPerPage;
  const pageData = data.slice(start, end);

  tbody.innerHTML = pageData.map(item => `
      <tr>
          <td>${item.geneId}</td>
          <td>${item.chromosome}</td>
          <td>${item.startPosition}</td>
          <td>${item.endPosition}</td>
          <td>${item.strand}</td>
      </tr>
  `).join('');

  updateShowingEntries(data.length);
}

// 设置分页
function setupPagination(data = geneData) {
  const totalPages = Math.ceil(data.length / config.itemsPerPage);
  const pagination = document.querySelector('.pagination');
  let paginationHTML = `
      <li class="page-item ${config.currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${config.currentPage - 1})">Previous</a>
      </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
          <li class="page-item ${config.currentPage === i ? 'active' : ''}">
              <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
          </li>
      `;
  }

  paginationHTML += `
      <li class="page-item ${config.currentPage === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${config.currentPage + 1})">Next</a>
      </li>
  `;

  pagination.innerHTML = paginationHTML;
}

// 切换页面
function changePage(page) {
  if (page < 1 || page > Math.ceil(geneData.length / config.itemsPerPage)) return;
  config.currentPage = page;
  renderTable(geneData);
  setupPagination();
}

// 更新显示条目信息
function updateShowingEntries(totalItems) {
  const start = (config.currentPage - 1) * config.itemsPerPage + 1;
  const end = Math.min(config.currentPage * config.itemsPerPage, totalItems);
  document.querySelector('.showing-entries').textContent = 
      `Showing ${start} to ${end} of ${totalItems} entries`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeTable);