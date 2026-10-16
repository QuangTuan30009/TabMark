export const defaultCollections = [
  {
    id: 'guide',
    name: 'Hướng dẫn & Bắt đầu',
    description: 'Làm quen và trải nghiệm các tính năng cốt lõi của TabMark.',
    links: [
      {
        id: 'guide1',
        title: 'Chào mừng đến với Tabmark!',
        url: 'https://tabmark.app',
        icon: 'sparkles',
        tags: ['Guide', 'Welcome'],
        note: 'Kéo thả thẻ này giữa các cột để thay đổi trạng thái tiến độ.',
        status: 'todo',
        time: '3 min'
      },
      {
        id: 'guide2',
        title: 'Khám phá tính năng AI Summary',
        url: 'https://tabmark.app/ai',
        icon: 'ai',
        tags: ['AI', 'Feature'],
        note: 'Bấm vào nút Sparkles hoặc AI để tạo tóm tắt thông minh.',
        status: 'in_progress',
        time: '5 min'
      }
    ]
  },
  {
    id: 'general-work',
    name: 'General Work',
    description: 'Không gian làm việc và tài liệu dự án cốt lõi.',
    links: [
      {
        id: 'gw1',
        title: 'Google Drive Storage',
        url: 'https://drive.google.com',
        icon: 'drive',
        tags: ['storage', 'google'],
        note: 'Kho lưu trữ tài liệu dự án, hồ sơ và file thuyết trình.',
        status: 'todo',
        time: '10 min'
      },
      {
        id: 'gw2',
        title: 'Bảng tính Google Sheets',
        url: 'https://docs.google.com/spreadsheets',
        icon: 'sheets',
        tags: ['work', 'data'],
        note: 'Bảng tính dữ liệu kinh doanh, quản lý chỉ số và theo dõi KPI.',
        status: 'in_progress',
        time: '15 min'
      },
      {
        id: 'gw3',
        title: 'GitHub - TabMark Repository',
        url: 'https://github.com/QuangTuan30009/TabMark',
        icon: 'gitlab',
        tags: ['code', 'github'],
        note: 'Kho mã nguồn chính thức và tiến độ phát triển hệ thống TabMark.',
        status: 'done',
        time: '20 min'
      },
      {
        id: 'gw4',
        title: 'Trello Kanban Board',
        url: 'https://trello.com',
        icon: 'trello',
        tags: ['management', 'task'],
        note: 'Bảng quản lý công việc và phân chia nhiệm vụ thành viên nhóm.',
        status: 'done',
        time: '10 min'
      },
      {
        id: 'gw5',
        title: 'Notion Workspace',
        url: 'https://www.notion.so',
        icon: 'docs',
        tags: ['notes', 'workspace'],
        note: 'Không gian ghi chú tài liệu, wiki cá nhân và quản lý kiến thức.',
        status: 'todo',
        time: '10 min'
      },
      {
        id: 'gw6',
        title: 'Google Meet',
        url: 'https://meet.google.com',
        icon: 'meet',
        tags: ['meeting', 'google'],
        note: 'Phòng họp trực tuyến và hội thảo nhóm nhanh chóng, ổn định.',
        status: 'done',
        time: '10 min'
      }
    ]
  },
  {
    id: 'ai-assistants',
    name: 'Trợ lý AI',
    description: 'Bộ công cụ trí tuệ nhân tạo tăng năng suất công việc.',
    links: [
      {
        id: 'ai1',
        title: 'ChatGPT (OpenAI)',
        url: 'https://chatgpt.com',
        icon: 'chatgpt',
        tags: ['ai', 'chatbot'],
        note: 'Trợ lý AI đa năng hỗ trợ nghiên cứu, soạn thảo văn bản và lập trình.',
        status: 'done',
        time: '5 min'
      },
      {
        id: 'ai2',
        title: 'Claude AI (Anthropic)',
        url: 'https://claude.ai',
        icon: 'claude',
        tags: ['ai', 'anthropic'],
        note: 'Mô hình AI phân tích văn bản dài và xử lý tài liệu chuyên sâu.',
        status: 'done',
        time: '10 min'
      },
      {
        id: 'ai3',
        title: 'Google Gemini',
        url: 'https://gemini.google.com',
        icon: 'gemini',
        tags: ['ai', 'google'],
        note: 'AI thế hệ mới của Google tích hợp dữ liệu tìm kiếm thời gian thực.',
        status: 'in_progress',
        time: '5 min'
      },
      {
        id: 'ai4',
        title: 'v0 by Vercel',
        url: 'https://v0.dev',
        icon: 'react',
        tags: ['ai', 'frontend'],
        note: 'Sinh mã giao diện React và Tailwind CSS nhanh chóng bằng AI Prompt.',
        status: 'todo',
        time: '15 min'
      },
      {
        id: 'ai5',
        title: 'Midjourney',
        url: 'https://www.midjourney.com',
        icon: 'midjourney',
        tags: ['ai', 'design'],
        note: 'Khởi tạo ý tưởng đồ họa và hình ảnh nghệ thuật độc đáo bằng AI.',
        status: 'todo',
        time: '20 min'
      }
    ]
  },
  {
    id: 'dev-design',
    name: 'Lập trình & UI/UX',
    description: 'Thư viện và công cụ phát triển phần mềm chuyên nghiệp.',
    links: [
      {
        id: 'dev1',
        title: 'Tailwind CSS Docs',
        url: 'https://tailwindcss.com/docs',
        icon: 'css',
        tags: ['css', 'tailwind'],
        note: 'Tài liệu tra cứu class utility và hướng dẫn phong cách thiết kế hiện đại.',
        status: 'done',
        time: '10 min'
      },
      {
        id: 'dev2',
        title: 'Shadcn/UI Components',
        url: 'https://ui.shadcn.com',
        icon: 'shadcn',
        tags: ['components', 'react'],
        note: 'Bộ UI component React cao cấp, mã nguồn mở và tùy biến linh hoạt.',
        status: 'done',
        time: '15 min'
      },
      {
        id: 'dev3',
        title: 'Lucide Icons Library',
        url: 'https://lucide.dev/icons',
        icon: 'lucide',
        tags: ['icons', 'svg'],
        note: 'Hơn 1,000+ vector icon tối giản, nhẹ nhàng và chuẩn UX.',
        status: 'in_progress',
        time: '5 min'
      },
      {
        id: 'dev4',
        title: 'Figma Design',
        url: 'https://www.figma.com',
        icon: 'design',
        tags: ['ui', 'ux'],
        note: 'Nền tảng thiết kế UI/UX và cộng tác prototype thời gian thực.',
        status: 'done',
        time: '30 min'
      },
      {
        id: 'dev5',
        title: 'dbdiagram.io',
        url: 'https://dbdiagram.io',
        icon: 'database',
        tags: ['database', 'schema'],
        note: 'Thiết kế và trực quan hóa sơ đồ cơ sở dữ liệu quan hệ (ERD).',
        status: 'todo',
        time: '20 min'
      }
    ]
  },
  {
    id: 'research-learning',
    name: 'Nghiên cứu & Học tập',
    description: 'Nền tảng tri thức, tài liệu học thuật và không gian ghi chú.',
    links: [
      {
        id: 'rs1',
        title: 'Google Scholar',
        url: 'https://scholar.google.com',
        icon: 'book',
        tags: ['research', 'academic'],
        note: 'Tra cứu bài báo khoa học, đề tài nghiên cứu và tài liệu học thuật.',
        status: 'done',
        time: '15 min'
      },
      {
        id: 'rs2',
        title: 'Coursera Online Courses',
        url: 'https://www.coursera.org',
        icon: 'docs',
        tags: ['learning', 'courses'],
        note: 'Nền tảng học trực tuyến các chứng chỉ công nghệ hàng đầu thế giới.',
        status: 'in_progress',
        time: '45 min'
      },
      {
        id: 'rs3',
        title: 'Notion Workspace',
        url: 'https://www.notion.so',
        icon: 'docs',
        tags: ['notes', 'workspace'],
        note: 'Không gian ghi chú tài liệu, wiki cá nhân và quản lý kiến thức.',
        status: 'done',
        time: '10 min'
      },
      {
        id: 'rs4',
        title: 'Google Meet',
        url: 'https://meet.google.com',
        icon: 'meet',
        tags: ['meeting', 'google'],
        note: 'Phòng họp trực tuyến và hội thảo nhóm nhanh chóng, ổn định.',
        status: 'todo',
        time: '10 min'
      }
    ]
  },
  {
    id: 'productivity-tools',
    name: 'Tiện ích Hàng ngày',
    description: 'Các công cụ tiện ích hỗ trợ công việc và sinh hoạt.',
    links: [
      {
        id: 'pr1',
        title: 'Chrome Web Store',
        url: 'https://chromewebstore.google.com',
        icon: 'chrome',
        tags: ['chrome', 'extension'],
        note: 'Cửa hàng tiện ích mở rộng cho trình duyệt Chrome.',
        status: 'done',
        time: '5 min'
      },
      {
        id: 'pr2',
        title: 'Speedtest by Ookla',
        url: 'https://www.speedtest.net',
        icon: 'video',
        tags: ['network', 'speed'],
        note: 'Đo tốc độ kết nối internet và độ trễ đường truyền mạng.',
        status: 'done',
        time: '2 min'
      },
      {
        id: 'pr3',
        title: 'Tra cứu Viettel Post',
        url: 'https://viettelpost.vn/tra-cuu-hanh-trinh-don',
        icon: 'delivery',
        tags: ['shipping', 'tracking'],
        note: 'Theo dõi lộ trình bưu phẩm và tình trạng chuyển phát nhanh.',
        status: 'in_progress',
        time: '5 min'
      },
      {
        id: 'pr4',
        title: 'Canva Pro',
        url: 'https://www.canva.com',
        icon: 'color',
        tags: ['design', 'presentation'],
        note: 'Thiết kế slide thuyết trình, đồ họa mạng xã hội và banner.',
        status: 'todo',
        time: '20 min'
      }
    ]
  }
]
