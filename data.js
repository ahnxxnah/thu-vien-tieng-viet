'use strict';
/* Câu hỏi biên soạn mới, bám các chủ điểm luyện từ và câu của Kết nối tri thức.
   Không sao chép nguyên văn câu hỏi trong SGK. */
const ZONES = {
  counter:{title:'Quầy quản lí',icon:'🧾',short:'Quầy thu ngân',desc:'Thẻ bạn đọc · trả sách · phí trễ · đồ lưu niệm', hue:'#d99581'},
  cafe:{title:'Góc cà phê',icon:'☕',short:'Góc cà phê',desc:'Đồ uống · bánh ngọt · phục vụ lịch sự',hue:'#cf9b66'},
  reading:{title:'Phòng đọc sách',icon:'📖',short:'Phòng đọc',desc:'Mượn sách · đọc sách · giữ yên lặng',hue:'#82ad9b'},
  warehouse:{title:'Kho & nhà cung cấp',icon:'📦',short:'Kho hàng',desc:'Sách · đồ ăn uống · đồ lưu niệm · kiểm kê',hue:'#9c97c4'}
};
const bank=[];
const add=(zone,grade,type,topic,speaker,question,options,answer,explain,extra={})=>bank.push({id:'q'+(bank.length+1),zone,grade,type,topic,speaker,question,options,answer,explain,...extra});
const mc=(z,g,t,s,q,opts,a,e)=>add(z,g,'mc',t,s,q,opts,a,e);
const multi=(z,g,t,s,q,opts,a,e)=>add(z,g,'multi',t,s,q,opts,a,e);
const order=(z,g,t,s,q,tokens,target,e)=>add(z,g,'order',t,s,q,tokens,target,e);
const write=(z,g,t,s,q,sample)=>add(z,g,'write',t,s,q,[],sample,'Viết một câu có nội dung phù hợp và kết thúc bằng dấu chấm. Hãy kiểm tra chữ hoa đầu câu và dấu chấm cuối câu.');

// ——— LỚP 1: âm, vần, câu hoàn chỉnh, chính tả cơ bản ———
mc('cafe',1,'Nguyên âm','Khách mua nước','Trong từ “cà phê” có các nguyên âm nào?', ['a','ê','a và ê','Không có'],2,'“cà” có âm a (mang thanh huyền), “phê” có ê.');
mc('cafe',1,'Vần','Khách mua bánh','Trong tiếng “bánh”, vần nào đúng?', ['anh','ang','ach','an'],0,'Tiếng “bánh” gồm âm đầu b, vần anh và thanh sắc.');
mc('cafe',1,'Dấu thanh','Khách gọi trà','Tiếng “trà” mang thanh gì?', ['Sắc','Hỏi','Huyền','Nặng'],2,'Tiếng “trà” có dấu huyền.');
multi('cafe',1,'Nhận biết từ','Khách chọn món','Hãy chọn TẤT CẢ các từ chỉ đồ uống nhé.', ['Nước cam','Bánh mì','Sữa tươi','Bút chì'],[0,2],'Nước cam và sữa tươi là đồ uống.');
order('cafe',1,'Ghép câu','Khách lấy nước','Hãy xếp lời đáp cho đúng:',['Đây','là','cốc','nước','của','bạn.'],'Đây là cốc nước của bạn.','Câu đúng đủ từ và kết thúc bằng dấu chấm.');
mc('cafe',1,'Câu trọn ý','Khách muốn uống nước','Bạn có nước cam không?', ['Có','Có nước','Có. Quán mình có nước cam.','Nước cam'],2,'Câu trả lời đầy đủ, rõ ràng và có dấu câu.');
mc('cafe',1,'Chính tả','Khách chọn món','Tên đồ uống nào viết đúng chính tả?', ['sữa Tươi','Sữa tươi','sữa tươi.','Sữa Tươi'],1,'Tên món ăn, đồ uống thông thường không cần viết hoa từng tiếng.');
write('cafe',1,'Viết câu','Khách nhờ giới thiệu','Hãy viết một câu giới thiệu món uống trong quán.','Quán có nước cam ngon.');

mc('reading',1,'Nguyên âm','Bạn nhỏ đọc truyện','Trong tiếng “sách”, nguyên âm nào xuất hiện?', ['a','ê','i','ư'],0,'Tiếng “sách” có chữ a mang dấu sắc.');
mc('reading',1,'Vần','Khách tìm truyện','Trong tiếng “truyện”, vần nào đúng?', ['uyên','uôn','iên','uyết'],0,'Tiếng “truyện” có vần uyên và thanh nặng.');
mc('reading',1,'Số tiếng','Khách tìm sách','Cụm từ “cuốn sách” có mấy tiếng?', ['Một','Hai','Ba','Bốn'],1,'“cuốn” và “sách” là hai tiếng.');
multi('reading',1,'Nhận biết từ','Khách hỏi đồ dùng','Chọn TẤT CẢ các từ chỉ đồ dùng để đọc hoặc viết.', ['Quyển sách','Cây bút','Con cá','Cơn mưa'],[0,1],'Quyển sách và cây bút là đồ dùng học tập.');
order('reading',1,'Ghép câu','Khách muốn mượn sách','Xếp lại câu trả lời cho đúng:', ['Đây','là','cuốn','sách','bạn','cần.'],'Đây là cuốn sách bạn cần.','Thứ tự đúng là: Đây là cuốn sách bạn cần.');
mc('reading',1,'Câu trọn ý','Khách tìm sách chim','Ở đây có cuốn “Chim sẻ và đại bàng” không?', ['Có','Có sách','Có. Mình có cuốn “Chim sẻ và đại bàng”.','Không biết'],2,'Lời đáp phải trọn ý, trả lời đúng điều khách hỏi.');
mc('reading',1,'Chính tả','Khách nhờ ghi biển','Đâu là câu viết đúng?', ['xin giữ trật tự.','Xin giữ trật tự.','Xin giữ trật tự','XIN giữ trật tự.'],1,'Viết hoa đầu câu và dùng dấu chấm cuối câu.');
write('reading',1,'Viết câu','Khách muốn biết nội quy','Hãy viết một câu nhắc bạn đọc giữ yên lặng.','Xin hãy giữ trật tự.');

mc('counter',1,'Nguyên âm','Khách làm thẻ','Trong tiếng “thẻ” có nguyên âm nào?', ['a','e','ê','i'],1,'Tiếng “thẻ” có nguyên âm e mang dấu hỏi.');
mc('counter',1,'Dấu thanh','Khách trả sách','Tiếng “trả” mang dấu thanh nào?', ['Ngã','Hỏi','Sắc','Huyền'],1,'“trả” mang dấu hỏi.');
mc('counter',1,'Số tiếng','Khách tìm quầy','Cụm từ “thẻ thư viện” có mấy tiếng?', ['Hai','Ba','Bốn','Năm'],1,'thẻ / thư / viện là ba tiếng.');
multi('counter',1,'Nhận biết từ','Khách tới quầy','Chọn TẤT CẢ những đồ dùng thường có ở quầy thư viện.', ['Thẻ bạn đọc','Phiếu mượn','Cây xoài','Giày thể thao'],[0,1],'Thẻ bạn đọc và phiếu mượn dùng trong quản lí thư viện.');
order('counter',1,'Ghép câu','Khách trả sách','Ghép lời đáp đúng cho khách:', ['Mình','đã','nhận','lại','sách','của','bạn.'],'Mình đã nhận lại sách của bạn.','Câu trả lời lịch sự và hoàn chỉnh.');
mc('counter',1,'Chính tả','Khách muốn làm thẻ','Câu nào đúng?', ['Mời bạn làm thẻ.','mời bạn làm thẻ.','Mời bạn làm thẻ','mời bạn làm Thẻ.'],0,'Đầu câu viết hoa, cuối câu có dấu chấm.');
mc('counter',1,'Câu trọn ý','Khách hỏi về sách','Mình có thể trả sách ở đây không?', ['Được','Trả sách','Được. Bạn có thể trả sách tại quầy này.','Ở đây'],2,'Câu trả lời rõ ràng và có ý trọn vẹn.');
write('counter',1,'Viết câu','Khách cần được hướng dẫn','Hãy viết một câu hướng dẫn khách làm thẻ thư viện.','Mời bạn điền thông tin làm thẻ.');

mc('warehouse',1,'Nguyên âm','Nhà cung cấp báo hàng','Trong tiếng “kho” có nguyên âm nào?', ['o','ô','ơ','a'],0,'“kho” có nguyên âm o.');
mc('warehouse',1,'Vần','Người giao hàng','Trong tiếng “hàng”, vần nào đúng?', ['ang','anh','ong','ăng'],0,'Tiếng “hàng” có vần ang.');
mc('warehouse',1,'Dấu thanh','Nhà cung cấp nhập giấy','Tiếng “giấy” mang dấu nào?', ['Huyền','Sắc','Hỏi','Nặng'],1,'Tiếng “giấy” mang dấu sắc.');
multi('warehouse',1,'Nhận biết từ','Nhà cung cấp giao kiện','Chọn TẤT CẢ những đồ có thể nhập vào kho thư viện.', ['Sách','Bút lưu niệm','Đám mây','Cơn gió'],[0,1],'Sách và bút lưu niệm là mặt hàng hữu hình.');
order('warehouse',1,'Ghép câu','Người giao hàng','Xếp lời nhận hàng đúng:', ['Mình','đã','nhận','thùng','sách','mới.'],'Mình đã nhận thùng sách mới.','Câu bắt đầu bằng chữ hoa và kết thúc bằng dấu chấm.');
mc('warehouse',1,'Chính tả','Nhà cung cấp hỏi','Câu nào viết đúng?', ['Kho đã có hàng.','kho đã có hàng.','Kho đã có hàng','Kho Đã có hàng.'],0,'Viết hoa đầu câu, thêm dấu chấm kết thúc.');
mc('warehouse',1,'Số tiếng','Nhà cung cấp kiểm hàng','Cụm từ “bưu thiếp” có mấy tiếng?', ['Một','Hai','Ba','Bốn'],1,'bưu / thiếp là hai tiếng.');
write('warehouse',1,'Viết câu','Nhà cung cấp cần ghi sổ','Hãy viết một câu nói về việc nhận sách mới.','Kho đã nhận sách mới.');

// ——— LỚP 2: từ chỉ sự vật/hoạt động/đặc điểm, câu giới thiệu/hoạt động/đặc điểm ———
mc('cafe',2,'Từ chỉ sự vật','Khách xem thực đơn','Trong câu “Ly sữa thơm ngon”, từ chỉ sự vật là từ nào?', ['Ly sữa','Thơm','Ngon','Rất'],0,'Ly sữa là sự vật; thơm, ngon là đặc điểm.');
mc('cafe',2,'Từ chỉ hoạt động','Khách quan sát pha chế','Trong câu “Cô bán hàng rót trà”, từ chỉ hoạt động là gì?', ['Cô','Trà','Rót','Hàng'],2,'Rót là hoạt động.');
mc('cafe',2,'Từ chỉ đặc điểm','Khách khen bánh','Từ nào chỉ đặc điểm của bánh?', ['Ăn','Bánh','Ngọt','Bán'],2,'Ngọt là đặc điểm chỉ vị.');
mc('cafe',2,'Kiểu câu','Khách hỏi về món','“Cốc nước cam rất mát.” thuộc kiểu câu nào?', ['Câu giới thiệu','Câu nêu hoạt động','Câu nêu đặc điểm','Câu hỏi'],2,'Câu nêu đặc điểm mát của cốc nước cam.');
multi('cafe',2,'Mở rộng vốn từ','Khách chọn quầy bánh','Chọn những từ chỉ hoạt động ở quán.', ['Pha trà','Rửa cốc','Thơm ngọt','Cốc thủy tinh'],[0,1],'Pha trà, rửa cốc là hoạt động.');
order('cafe',2,'Đặt câu','Khách muốn lời giới thiệu','Sắp xếp thành câu giới thiệu:', ['Đây','là','món','bánh','mới','của','quán.'],'Đây là món bánh mới của quán.','Đây là … là một mẫu câu giới thiệu.');
mc('cafe',2,'Dấu câu','Khách thử bánh','“Ôi, bánh ngon quá__” Điền dấu phù hợp.', ['.',',','?','!'],3,'Câu cảm bộc lộ cảm xúc, dùng dấu chấm than.');

mc('reading',2,'Từ chỉ sự vật','Khách đọc sách','Từ nào chỉ sự vật trong phòng đọc?', ['Yên tĩnh','Quyển truyện','Đọc','Giữ gìn'],1,'Quyển truyện là sự vật.');
mc('reading',2,'Từ chỉ hoạt động','Khách đi tìm sách','Bạn nhỏ “lật” từng trang sách. “Lật” thuộc nhóm từ nào?', ['Chỉ sự vật','Chỉ hoạt động','Chỉ đặc điểm','Chỉ màu sắc'],1,'Lật chỉ hành động.');
mc('reading',2,'Từ chỉ đặc điểm','Khách khen phòng đọc','Từ nào chỉ đặc điểm?', ['Yên tĩnh','Mượn','Bạn đọc','Trả'],0,'Yên tĩnh nêu đặc điểm của không gian.');
mc('reading',2,'Kiểu câu','Khách giới thiệu sách','“Đây là sách khoa học.” thuộc kiểu câu nào?', ['Câu nêu hoạt động','Câu giới thiệu','Câu nêu đặc điểm','Câu khiến'],1,'Câu sử dụng “Đây là…” để giới thiệu.');
multi('reading',2,'Từ ngữ','Khách giữ vệ sinh','Chọn những từ chỉ hoạt động tốt khi đọc sách.', ['Xếp sách','Lật nhẹ trang','La hét','Vẽ bậy'],[0,1],'Xếp sách và lật nhẹ trang giúp giữ gìn sách.');
order('reading',2,'Đặt câu','Khách nhờ nói lịch sự','Xếp một câu nêu hoạt động:', ['Bạn','Mai','đang','đọc','sách.'],'Bạn Mai đang đọc sách.','Câu nêu hoạt động đọc sách.');
mc('reading',2,'Dấu câu','Khách tìm sách','“Cuốn truyện này ở đâu__” Điền dấu cuối câu.', ['.','!','?',','],2,'Câu hỏi kết thúc bằng dấu hỏi.');

mc('counter',2,'Từ chỉ sự vật','Khách làm thẻ','Từ nào chỉ sự vật?', ['Thu phí','Nhanh chóng','Thẻ thư viện','Kiểm tra'],2,'Thẻ thư viện là một đồ vật.');
mc('counter',2,'Từ chỉ hoạt động','Khách thanh toán','Trong câu “Nhân viên thu tiền”, từ chỉ hoạt động là?', ['Nhân viên','Thu','Tiền','Quầy'],1,'Thu là hoạt động.');
mc('counter',2,'Từ chỉ đặc điểm','Khách nhận xét nhân viên','Từ nào chỉ đặc điểm?', ['Lịch sự','Đưa','Trả','Phiếu'],0,'Lịch sự chỉ phẩm chất, cách cư xử.');
mc('counter',2,'Kiểu câu','Khách tới quầy','“Nhân viên đang làm thẻ.” là kiểu câu nào?', ['Câu giới thiệu','Câu nêu hoạt động','Câu nêu đặc điểm','Câu cảm'],1,'Câu nêu hoạt động làm thẻ.');
multi('counter',2,'Mở rộng vốn từ','Khách mượn sách','Chọn các từ chỉ hoạt động tại quầy.', ['Ghi phiếu','Trả sách','Phiếu thu','Sạch sẽ'],[0,1],'Ghi và trả là các hoạt động.');
order('counter',2,'Đặt câu','Khách khen quầy','Xếp thành câu nêu đặc điểm:', ['Quầy','thu','ngân','rất','gọn','gàng.'],'Quầy thu ngân rất gọn gàng.','Câu nêu đặc điểm gọn gàng.');
mc('counter',2,'Dấu câu','Khách hỏi hạn trả','“Khi nào tôi phải trả sách__” Điền dấu câu.', ['.','?',',','!'],1,'Dấu hỏi kết thúc câu hỏi.');

mc('warehouse',2,'Từ chỉ sự vật','Nhà cung cấp đưa hàng','Từ nào chỉ sự vật?', ['Kiểm hàng','Hộp quà','Nhanh','Xếp'],1,'Hộp quà là sự vật.');
mc('warehouse',2,'Từ chỉ hoạt động','Người giao hàng','Từ nào chỉ hoạt động nhập kho?', ['Sắp xếp','Đầy','Rộng','Kệ'],0,'Sắp xếp chỉ hành động.');
mc('warehouse',2,'Từ chỉ đặc điểm','Nhà cung cấp xem kho','Từ nào miêu tả kho?', ['Nhập','Kho','Ngăn nắp','Đóng gói'],2,'Ngăn nắp là từ chỉ đặc điểm.');
mc('warehouse',2,'Kiểu câu','Nhà cung cấp hỏi','“Những giá sách rất chắc chắn.” thuộc kiểu câu nào?', ['Câu giới thiệu','Câu nêu đặc điểm','Câu nêu hoạt động','Câu hỏi'],1,'Câu nêu đặc điểm chắc chắn.');
multi('warehouse',2,'Mở rộng vốn từ','Người kiểm kho','Chọn những từ chỉ đồ dùng trong kho.', ['Kệ sách','Thùng giấy','Bảo quản','Kiểm đếm'],[0,1],'Kệ sách và thùng giấy là đồ dùng.');
order('warehouse',2,'Đặt câu','Nhà cung cấp cần lời mô tả','Sắp xếp thành câu nêu hoạt động:', ['Nhân','viên','đang','kiểm','hàng.'],'Nhân viên đang kiểm hàng.','Câu nêu hoạt động kiểm hàng.');
mc('warehouse',2,'Dấu câu','Nhà cung cấp ngạc nhiên','“Ôi, nhiều sách mới quá__” Điền dấu câu.', ['!','?',',','.'],0,'Câu cảm dùng dấu chấm than.');

// ——— LỚP 3: câu theo mục đích nói, từ đồng/trái nghĩa, so sánh, dấu câu ———
mc('cafe',3,'Từ gần nghĩa','Khách khen đồ uống','Từ nào gần nghĩa với “thơm ngon” khi nói về bánh?', ['Hấp dẫn','Cay đắng','Khô khan','Lặng lẽ'],0,'Thơm ngon và hấp dẫn có nét nghĩa gần nhau trong ngữ cảnh món ăn.');
mc('cafe',3,'Từ trái nghĩa','Khách muốn đồ uống','Từ trái nghĩa với “nóng” là gì?', ['Ấm','Lạnh','Thơm','Ngọt'],1,'Nóng và lạnh trái nghĩa.');
mc('cafe',3,'Câu cảm','Khách ăn bánh','“Ôi, chiếc bánh thơm quá!” thuộc kiểu câu nào?', ['Câu kể','Câu hỏi','Câu khiến','Câu cảm'],3,'Từ Ôi và dấu ! giúp bộc lộ cảm xúc.');
mc('cafe',3,'So sánh','Khách mô tả món','Câu nào có hình ảnh so sánh?', ['Bánh rất ngọt.','Chiếc bánh tròn như mặt trăng.','Em ăn bánh.','Cốc nước trên bàn.'],1,'Dùng “như” để so sánh hình dáng.');
mc('cafe',3,'Câu khiến','Khách muốn gọi món','Đâu là câu khiến?', ['Cà phê ngon quá!','Bạn có trà không?','Cho mình một ly sữa nhé!','Ly sữa đang trên bàn.'],2,'Câu đề nghị, yêu cầu là câu khiến.');
order('cafe',3,'Đặt câu','Khách muốn hỏi lịch sự','Xếp thành câu hỏi hoàn chỉnh:', ['Quán','còn','nước','cam','không?'],'Quán còn nước cam không?','Câu hỏi kết thúc bằng dấu hỏi.');
mc('cafe',3,'Dấu hai chấm','Khách nghe người pha chế','Chọn dấu thích hợp: Người pha chế nói__ “Mời bạn thưởng thức!”', ['?',':','!',';'],1,'Dấu hai chấm báo hiệu lời nói trực tiếp.');

mc('reading',3,'Từ gần nghĩa','Khách nhận xét truyện','Từ nào gần nghĩa với “hay” khi khen truyện?', ['Hấp dẫn','Tối tăm','Cũ kĩ','Khó đọc'],0,'Một câu chuyện hay có thể rất hấp dẫn.');
mc('reading',3,'Từ trái nghĩa','Khách giữ nội quy','Trái nghĩa với “ồn ào” là gì?', ['Náo nhiệt','Yên tĩnh','Rộn ràng','Vui vẻ'],1,'Ồn ào đối lập với yên tĩnh.');
mc('reading',3,'Câu khiến','Khách nhắc bạn đọc','Đâu là câu khiến?', ['Thư viện rất yên tĩnh.','Bạn đọc sách gì?','Xin hãy nói nhỏ!','Ôi, sách đẹp quá!'],2,'Đây là lời đề nghị.');
mc('reading',3,'So sánh','Khách đọc truyện thiên nhiên','Câu nào có so sánh?', ['Trang sách thơm mùi giấy.','Trang sách trắng như tuyết.','Em lật sách.','Cuốn sách dày.'],1,'Trang sách được so sánh với tuyết về màu trắng.');
mc('reading',3,'Câu hỏi','Khách tìm truyện','Đâu là câu hỏi?', ['Bộ truyện thật hay!','Bạn có sách khoa học không?','Hãy lật nhẹ trang.','Em đang đọc sách.'],1,'Có từ không và dấu hỏi cuối câu.');
order('reading',3,'Đặt câu','Khách muốn nhắc nội quy','Sắp xếp câu khiến lịch sự:', ['Xin','hãy','giữ','im','lặng!'],'Xin hãy giữ im lặng!','Từ Xin hãy biểu thị đề nghị.');
mc('reading',3,'Dấu ngoặc kép','Khách trích lời nhân vật','Dấu nào thường dùng để đánh dấu lời nói dẫn trực tiếp?', ['Dấu chấm','Dấu ngoặc kép','Dấu phẩy','Dấu hỏi'],1,'Lời nói trực tiếp thường đặt trong dấu ngoặc kép.');

mc('counter',3,'Từ gần nghĩa','Khách phản hồi dịch vụ','Từ nào gần nghĩa với “nhanh chóng”?', ['Mau lẹ','Chậm chạp','Rề rà','Lâu lắc'],0,'Nhanh chóng gần nghĩa với mau lẹ.');
mc('counter',3,'Từ trái nghĩa','Khách nói về hạn trả','Trái nghĩa với “đúng hạn” là gì?', ['Kịp giờ','Sớm','Quá hạn','Đúng lúc'],2,'Quá hạn là sau hạn quy định.');
mc('counter',3,'Câu hỏi','Khách muốn đóng phí','Câu nào là câu hỏi?', ['Bạn đã trả sách chưa?','Mời bạn làm thẻ!','Sách đã được trả.','Ôi, đông khách quá!'],0,'Đặt câu hỏi về việc trả sách.');
mc('counter',3,'Câu khiến','Nhân viên nhắc khách','Câu nào thể hiện lời đề nghị?', ['Thẻ này mới.','Xin vui lòng xếp hàng.','Bạn đến khi nào?','Quầy đẹp quá!'],1,'“Xin vui lòng…” nêu lời đề nghị lịch sự.');
mc('counter',3,'So sánh','Khách nói về quầy','Câu nào sử dụng so sánh?', ['Quầy sạch sẽ.','Quầy đông người.','Thẻ xếp ngay ngắn như hàng quân.','Tôi nhận phiếu.'],2,'Cách xếp thẻ được so sánh với hàng quân.');
order('counter',3,'Đặt câu','Khách quên thẻ','Xếp thành câu hỏi:', ['Mình','có','thể','làm','lại','thẻ','không?'],'Mình có thể làm lại thẻ không?','Câu hỏi cần dấu ?.');
mc('counter',3,'Dấu hai chấm','Khách nghe thông báo','Dấu thích hợp: Nhân viên nhắc__ “Bạn nhớ trả sách đúng hạn.”', [':','?','!',','],0,'Dấu hai chấm báo hiệu lời nói được dẫn.');

mc('warehouse',3,'Từ gần nghĩa','Nhà cung cấp kiểm hàng','Từ nào gần nghĩa với “ngăn nắp”?', ['Gọn gàng','Bừa bộn','Lộn xộn','Chật chội'],0,'Ngăn nắp gần nghĩa với gọn gàng.');
mc('warehouse',3,'Từ trái nghĩa','Người giao hàng kiểm kho','Từ trái nghĩa với “đầy” là?', ['Rỗng','Nhiều','Chật','Dày'],0,'Đầy đối lập với rỗng.');
mc('warehouse',3,'Câu khiến','Nhà cung cấp giao kiện','Đâu là câu khiến?', ['Kho đã nhận hàng.','Xin hãy để kiện hàng lên kệ!','Kho rộng quá!','Kho ở đâu?'],1,'Câu dùng để đề nghị người khác.');
mc('warehouse',3,'So sánh','Nhân viên nhìn giá sách','Câu nào có hình ảnh so sánh?', ['Kệ xếp gọn.','Thùng giấy nặng.','Các thùng hàng ngay ngắn như đoàn tàu.','Cửa kho mở.'],2,'Xếp thùng hàng được so sánh với đoàn tàu.');
mc('warehouse',3,'Câu cảm','Nhà cung cấp thấy nhiều sách','Đâu là câu cảm?', ['Bạn cần hộp nào?','Hãy kiểm hàng.','Ôi, kho sách rộng quá!','Hàng ở trên kệ.'],2,'Câu cảm bộc lộ ngạc nhiên.');
order('warehouse',3,'Đặt câu','Nhà cung cấp cần kiểm tra','Sắp xếp thành câu khiến:', ['Hãy','xếp','sách','ngay','ngắn','nhé!'],'Hãy xếp sách ngay ngắn nhé!','Dùng Hãy để nêu yêu cầu.');
mc('warehouse',3,'Dấu hai chấm','Nhà cung cấp đọc phiếu','Dấu thích hợp: Phiếu ghi__ “Đã nhận đủ sách.”', [',',':','?','.'],1,'Dấu hai chấm báo hiệu nội dung được dẫn.');

// ——— LỚP 4: danh/động/tính từ, chủ ngữ, vị ngữ, trạng ngữ, nhân hóa ———
mc('cafe',4,'Danh từ','Khách gọi món','Từ nào là danh từ?', ['Pha','Thơm','Bánh ngọt','Nhanh'],2,'Bánh ngọt là từ ngữ chỉ sự vật.');
mc('cafe',4,'Động từ','Khách xem pha chế','Từ nào là động từ?', ['Rót','Cốc','Mát','Nâu'],0,'Rót chỉ hoạt động.');
mc('cafe',4,'Tính từ','Khách khen món','Từ nào là tính từ?', ['Bán','Ngọt','Uống','Khách'],1,'Ngọt chỉ đặc điểm, tính chất của món.');
mc('cafe',4,'Chủ ngữ','Khách kể chuyện','Chủ ngữ trong “Cô pha chế làm bánh.” là?', ['Làm bánh','Cô pha chế','Bánh','Pha chế'],1,'“Cô pha chế” trả lời câu hỏi Ai?');
mc('cafe',4,'Vị ngữ','Khách xem phục vụ','Vị ngữ trong “Nhân viên đang rót trà.” là?', ['Nhân viên','Trà','Đang rót trà','Nhân'],2,'Vị ngữ nêu hoạt động của nhân viên.');
mc('cafe',4,'Trạng ngữ','Khách hỏi giờ mở cửa','Trong câu “Buổi sáng, quán phục vụ trà nóng.”, trạng ngữ là?', ['Quán','Buổi sáng','Phục vụ','Trà nóng'],1,'Buổi sáng chỉ thời gian.');
mc('cafe',4,'Nhân hóa','Khách viết mô tả','Câu nào có nhân hóa?', ['Chiếc bánh tròn như trăng.','Tách trà mỉm cười chào khách.','Tách trà màu trắng.','Bánh rất thơm.'],1,'Tách trà được gán hoạt động mỉm cười của con người.');

mc('reading',4,'Danh từ','Khách đọc sách','Từ nào là danh từ?', ['Đọc','Tủ sách','Yên','Nhanh'],1,'Tủ sách là một đồ vật.');
mc('reading',4,'Động từ','Khách lật trang sách','Từ nào là động từ?', ['Mới','Lật','Tròn','Bìa'],1,'Lật chỉ hoạt động.');
mc('reading',4,'Tính từ','Khách tả sách','Từ nào là tính từ?', ['Bìa','Sách','Dày','Đọc'],2,'Dày chỉ đặc điểm kích thước của sách.');
mc('reading',4,'Chủ ngữ','Khách đọc truyện','Chủ ngữ trong “Bạn An đang đọc truyện.” là?', ['Đang đọc','Bạn An','Truyện','Đọc truyện'],1,'Bạn An là người được nói đến.');
mc('reading',4,'Vị ngữ','Khách mô tả phòng','Vị ngữ trong “Phòng đọc rất yên tĩnh.” là?', ['Phòng đọc','Rất yên tĩnh','Yên','Đọc'],1,'Vị ngữ nêu đặc điểm của phòng đọc.');
mc('reading',4,'Trạng ngữ','Khách kể chuyện','Trong câu “Trên giá sách, những cuốn truyện nằm ngay ngắn.”, trạng ngữ là?', ['Những cuốn truyện','Nằm ngay ngắn','Trên giá sách','Truyện'],2,'Trên giá sách chỉ nơi chốn.');
mc('reading',4,'Nhân hóa','Khách kể về truyện','Câu nào có nhân hóa?', ['Trang sách thì thầm lời kể.','Sách dày như viên gạch.','Sách màu xanh.','Em mua sách.'],0,'Trang sách được miêu tả như biết thì thầm.');

mc('counter',4,'Danh từ riêng','Khách làm thẻ','Từ ngữ nào là tên riêng?', ['Thủ thư','Phiếu mượn','Nguyễn An','Quầy sách'],2,'Nguyễn An là tên riêng của người.');
mc('counter',4,'Động từ','Khách trả sách','Từ nào là động từ?', ['Kiểm tra','Giấy','Mới','Xanh'],0,'Kiểm tra là hoạt động.');
mc('counter',4,'Tính từ','Khách khen nhân viên','Từ nào là tính từ?', ['Tiếp nhận','Niềm nở','Mã thẻ','Hóa đơn'],1,'Niềm nở chỉ thái độ.');
mc('counter',4,'Chủ ngữ','Khách xin gia hạn','Chủ ngữ trong “Người thủ thư đang gia hạn sách.” là?', ['Đang gia hạn sách','Người thủ thư','Sách','Gia hạn'],1,'Người thủ thư là đối tượng thực hiện hoạt động.');
mc('counter',4,'Vị ngữ','Khách đợi làm thẻ','Vị ngữ trong “Chiếc thẻ này rất mới.” là?', ['Chiếc thẻ','Này','Rất mới','Thẻ này'],2,'Rất mới nêu đặc điểm của chiếc thẻ.');
mc('counter',4,'Trạng ngữ','Khách trả sách muộn','Trong câu “Vì trả sách muộn, bạn cần báo cho quầy.”, trạng ngữ là?', ['Bạn','Vì trả sách muộn','Cần báo','Cho quầy'],1,'Nêu nguyên nhân phải báo cho quầy.');
mc('counter',4,'Nhân hóa','Khách mô tả tấm thẻ','Câu nào có nhân hóa?', ['Chiếc thẻ nhỏ như bàn tay.','Tấm thẻ vui vẻ chào chủ nhân.','Tấm thẻ hình chữ nhật.','Thẻ màu xanh.'],1,'Tấm thẻ được gán cảm xúc vui vẻ.');

mc('warehouse',4,'Danh từ','Nhà cung cấp hỏi','Từ nào là danh từ?', ['Kệ hàng','Sắp xếp','Bền','Đẹp'],0,'Kệ hàng là đồ vật.');
mc('warehouse',4,'Động từ','Nhà cung cấp kiểm kho','Từ nào là động từ?', ['Đếm','Nhiều','Nhẹ','Thùng'],0,'Đếm chỉ hoạt động kiểm số hàng.');
mc('warehouse',4,'Tính từ','Người kiểm kho','Từ nào là tính từ?', ['Thùng hàng','Nhập','Chắc chắn','Kê'],2,'Chắc chắn chỉ đặc điểm của đồ vật.');
mc('warehouse',4,'Chủ ngữ','Người giao hàng','Chủ ngữ của “Nhà cung cấp chuyển sách mới.” là?', ['Chuyển sách mới','Nhà cung cấp','Sách mới','Chuyển'],1,'Nhà cung cấp là người thực hiện hoạt động.');
mc('warehouse',4,'Vị ngữ','Nhà cung cấp xem kho','Vị ngữ của “Các thùng hàng được xếp gọn.” là?', ['Các thùng hàng','Được xếp gọn','Thùng hàng','Các'],1,'Vị ngữ nêu trạng thái của các thùng hàng.');
mc('warehouse',4,'Trạng ngữ','Nhân viên ghi sổ','“Vào buổi chiều, xe giao sách đến kho.”, trạng ngữ là?', ['Xe giao sách','Đến kho','Vào buổi chiều','Sách'],2,'Vào buổi chiều chỉ thời gian.');
mc('warehouse',4,'Nhân hóa','Người giao hàng viết lời quảng cáo','Câu nào có nhân hóa?', ['Kệ sách đứng thẳng như cây.','Thùng sách reo vui khi gặp bạn mới.','Thùng giấy màu nâu.','Sách rất nặng.'],1,'Thùng sách được miêu tả như biết reo vui.');

// ——— LỚP 5: đại từ, kết từ, đa nghĩa, câu ghép, liên kết, điệp từ ———
mc('cafe',5,'Đại từ','Khách nói về bạn pha chế','“Mai pha trà rất ngon. Cô ấy rất khéo.” Từ thay thế “Mai” là?', ['Pha trà','Rất','Cô ấy','Khéo'],2,'Cô ấy là cách gọi thay thế cho Mai.');
mc('cafe',5,'Kết từ','Khách chọn món','Điền kết từ: “Tôi muốn bánh __ nước cam.”', ['và','vì','nên','tuy'],0,'Và nối hai món khách muốn gọi.');
mc('cafe',5,'Câu ghép','Khách kể về bữa sáng','Đâu là câu ghép?', ['Bánh rất thơm.','Vì trời nóng nên khách gọi nước mát.','Nhân viên rót trà.','Ly nước trên bàn.'],1,'Hai vế: trời/nóng và khách/gọi nước mát.');
mc('cafe',5,'Liên kết câu','Khách kể về món mới','“Chiếc bánh vừa ra lò. Nó tỏa mùi thơm.” Liên kết bằng cách nào?', ['Lặp từ ngữ','Thay thế từ ngữ','Từ nối','Không có'],1,'Nó thay cho chiếc bánh.');
mc('cafe',5,'Điệp từ','Khách làm biển quảng cáo','“Ngon từ bánh, ngon từ sữa, ngon từ trái cây.” Từ lặp là?', ['Từ','Sữa','Ngon','Trái cây'],2,'Lặp lại “ngon” để nhấn mạnh.');
mc('cafe',5,'Từ đa nghĩa','Khách xem biển hiệu','Trong “miệng cốc” và “miệng người”, từ “miệng” là hiện tượng nào?', ['Từ đa nghĩa','Từ trái nghĩa','Từ đồng âm không liên quan','Động từ'],0,'Miệng cốc gọi phần mở trên cùng, có liên hệ với nghĩa gốc của miệng người.');
order('cafe',5,'Cặp kết từ','Khách giải thích lựa chọn','Xếp câu ghép chỉ nguyên nhân – kết quả:', ['Vì','trời','nóng','nên','mình','gọi','nước','mát.'],'Vì trời nóng nên mình gọi nước mát.','Vì … nên … chỉ quan hệ nguyên nhân – kết quả.');

mc('reading',5,'Đại từ','Khách kể về thủ thư','“Lan thích truyện. Bạn ấy đọc mỗi tối.” Đại từ thay Lan là?', ['Mỗi tối','Bạn ấy','Truyện','Đọc'],1,'Bạn ấy thay cho Lan.');
mc('reading',5,'Kết từ','Khách nói về phòng đọc','Điền kết từ: “Thư viện yên tĩnh __ nhiều người thích đến đây.”', ['nên','nhưng','và','tuy'],0,'Nên chỉ kết quả của nguyên nhân đã nêu.');
mc('reading',5,'Câu ghép','Khách đọc truyện','Đâu là câu ghép?', ['Quyển truyện nằm trên bàn.','Bé đọc sách.','Lan đọc truyện còn Nam tìm sách.','Phòng đọc rộng.'],2,'Hai vế câu: Lan/đọc truyện và Nam/tìm sách.');
mc('reading',5,'Liên kết câu','Khách giới thiệu sách','“Cuốn sách này rất thú vị. Cuốn sách còn có tranh đẹp.” Liên kết bằng?', ['Lặp từ ngữ','Thay thế từ ngữ','Nối bằng nhưng','Không liên kết'],0,'Lặp cụm từ “Cuốn sách”.');
mc('reading',5,'Điệp từ','Khách đọc thơ tự sáng tác','“Đọc để hiểu, đọc để yêu, đọc để lớn lên.” Từ được điệp lại là?', ['Hiểu','Đọc','Lớn','Yêu'],1,'Lặp từ đọc tạo nhịp và nhấn mạnh việc đọc.');
mc('reading',5,'Từ đa nghĩa','Khách nói về truyện','Trong “lưng sách” và “lưng người”, từ lưng thể hiện?', ['Từ đa nghĩa','Từ trái nghĩa','Từ đồng nghĩa','Danh từ riêng'],0,'Lưng sách là bộ phận gáy sách, dùng nghĩa chuyển có liên hệ nghĩa gốc.');
order('reading',5,'Câu ghép','Khách kể thói quen đọc','Xếp câu ghép đúng:', ['Lan','đọc','sách','còn','An','ghi','chép.'],'Lan đọc sách còn An ghi chép.','Hai vế câu được nối bằng kết từ còn.');

mc('counter',5,'Đại từ','Khách kể về thủ thư','“Chị Hoa đã làm thẻ. Chị ấy rất vui vẻ.” Từ thay “Chị Hoa” là?', ['Thẻ','Chị ấy','Vui vẻ','Đã'],1,'Chị ấy là đại từ xưng hô dùng để thay thế trong ngữ cảnh.');
mc('counter',5,'Kết từ','Khách báo trả sách muộn','Điền kết từ: “__ trả sách trễ __ tôi cần báo cho quầy.”', ['Vì … nên …','Tuy … nhưng …','Nếu … thì …','Và … và …'],0,'Vì … nên … chỉ nguyên nhân – kết quả.');
mc('counter',5,'Câu ghép','Khách làm thẻ','Câu nào là câu ghép?', ['Thẻ đã in xong.','Nhân viên ghi tên và in thẻ.','Khách điền phiếu còn nhân viên kiểm tra.','Quầy thu ngân rộng.'],2,'Khách/điền phiếu và nhân viên/kiểm tra là hai vế.');
mc('counter',5,'Liên kết câu','Khách kể về giấy tờ','“Chiếc thẻ đã làm xong. Nhờ vậy, tôi có thể mượn sách.” Liên kết bằng?', ['Từ ngữ nối','Từ trái nghĩa','Điệp từ','So sánh'],0,'Nhờ vậy liên kết hai câu theo quan hệ kết quả.');
mc('counter',5,'Điệp từ','Khách đọc nội quy','“Trả sách đúng hạn, trả sách nguyên vẹn, trả sách đúng quầy.” Cụm từ lặp là?', ['Đúng hạn','Trả sách','Nguyên vẹn','Đúng quầy'],1,'Lặp “trả sách” để nhấn mạnh trách nhiệm.');
mc('counter',5,'Từ đa nghĩa','Khách quan sát sổ sách','Trong “đầu trang” và “đầu người”, từ “đầu” là?', ['Từ đa nghĩa','Từ trái nghĩa','Từ chỉ hoạt động','Danh từ riêng'],0,'Đầu trang chỉ phần đầu tiên, có liên hệ nghĩa gốc.');
order('counter',5,'Cặp kết từ','Khách sợ mất thẻ','Xếp câu ghép có điều kiện:', ['Nếu','mất','thẻ','thì','bạn','hãy','báo','cho','quầy.'],'Nếu mất thẻ thì bạn hãy báo cho quầy.','Nếu … thì … diễn tả điều kiện.');

mc('warehouse',5,'Đại từ','Nhà cung cấp nói về hàng','“Thùng sách rất nặng. Nó cần được kê thấp.” Từ thay thùng sách là?', ['Rất','Được','Nó','Thấp'],2,'Nó thay cho thùng sách.');
mc('warehouse',5,'Kết từ','Nhà cung cấp báo trễ','Điền từ nối: “Xe đến trễ __ kho vẫn kịp nhận hàng.”', ['vì','nhưng','nên','và'],1,'Nhưng chỉ quan hệ tương phản.');
mc('warehouse',5,'Câu ghép','Nhân viên kiểm hàng','Câu nào là câu ghép?', ['Thùng hàng nặng.','Người giao xếp thùng còn thủ kho ghi sổ.','Thủ kho đang kiểm hàng.','Kệ rất cao.'],1,'Hai vế: Người giao/xếp thùng và thủ kho/ghi sổ.');
mc('warehouse',5,'Liên kết câu','Người giao nói về kệ','“Kệ đã đầy. Vì vậy, chúng ta cần thêm giá sách.” Liên kết bằng?', ['Lặp từ ngữ','Thay thế từ ngữ','Từ ngữ nối','So sánh'],2,'Vì vậy kết nối ý nguyên nhân – kết quả.');
mc('warehouse',5,'Điệp từ','Nhà cung cấp nhắc việc','“Kiểm sách, kiểm bút, kiểm đồ lưu niệm.” Từ được lặp là?', ['Kiểm','Sách','Bút','Đồ'],0,'Kiểm được lặp lại để nhấn mạnh các công việc.');
mc('warehouse',5,'Từ đa nghĩa','Nhà cung cấp kiểm sổ','Trong “mặt bàn” và “mặt người”, từ mặt là?', ['Từ đa nghĩa','Từ trái nghĩa','Từ đồng nghĩa','Tên riêng'],0,'Mặt bàn là bề mặt có liên hệ với nghĩa gốc.');
order('warehouse',5,'Câu ghép','Người giao hàng','Xếp câu ghép biểu thị tương phản:', ['Tuy','trời','mưa','nhưng','xe','vẫn','giao','hàng.'],'Tuy trời mưa nhưng xe vẫn giao hàng.','Tuy … nhưng … chỉ quan hệ tương phản.');

const ITEMS_DEFAULT=[
{id:'coffee',name:'Cà phê',category:'Đồ uống',cost:6,price:20,qty:12,emoji:'☕'},
{id:'orange',name:'Nước cam',category:'Đồ uống',cost:7,price:24,qty:12,emoji:'🍊'},
{id:'milk',name:'Sữa tươi',category:'Đồ uống',cost:5,price:18,qty:12,emoji:'🥛'},
{id:'cake',name:'Bánh ngọt',category:'Đồ ăn',cost:8,price:25,qty:12,emoji:'🍰'},
{id:'bread',name:'Bánh mì',category:'Đồ ăn',cost:7,price:23,qty:12,emoji:'🥖'},
{id:'book1',name:'Chim sẻ và đại bàng',category:'Sách',cost:15,price:42,qty:9,emoji:'📗'},
{id:'book2',name:'Thế giới động vật',category:'Sách',cost:17,price:48,qty:9,emoji:'📚'},
{id:'book3',name:'Khám phá vũ trụ',category:'Sách',cost:18,price:52,qty:9,emoji:'📘'},
{id:'bookmark',name:'Đánh dấu trang',category:'Lưu niệm',cost:4,price:15,qty:9,emoji:'🔖'},
{id:'postcard',name:'Bưu thiếp',category:'Lưu niệm',cost:5,price:18,qty:9,emoji:'💌'}
];
const COST_BY_CATEGORY={'Đồ uống':6,'Đồ ăn':7,'Sách':16,'Lưu niệm':5};
const CATEGORY_EMOJI={'Đồ uống':'🥤','Đồ ăn':'🥐','Sách':'📚','Lưu niệm':'🎁'};
const UPGRADES={
  counter:{name:'Quầy thu ngân',icon:'🧾',cost:65,desc:'Thao tác nhanh và thưởng dịch vụ tăng'},
  cafe:{name:'Máy pha cà phê',icon:'☕',cost:70,desc:'Quầy đẹp hơn và thưởng đồ uống tăng'},
  reading:{name:'Giá sách ấm áp',icon:'📚',cost:85,desc:'Thêm góc đọc, thu hút bạn đọc'},
  warehouse:{name:'Kho thông minh',icon:'📦',cost:60,desc:'Kho được trang trí và hoạt động hiệu quả'}
};
const ACHIEVEMENTS=[
 {id:'day',name:'Người giữ thư viện',icon:'🏡',thresholds:[1,3,7,15,30],stat:'daysWon'},
 {id:'correct',name:'Siêu sao tiếng Việt',icon:'✏️',thresholds:[5,15,35,75,150],stat:'correct'},
 {id:'reading',name:'Bạn của sách',icon:'📖',thresholds:[3,10,25,50,100],stat:'reading'},
 {id:'cafe',name:'Chủ quán tí hon',icon:'☕',thresholds:[3,10,25,50,100],stat:'cafe'},
 {id:'cashier',name:'Thủ thư tận tâm',icon:'🎟️',thresholds:[3,10,25,50,100],stat:'counter'},
 {id:'stock',name:'Người giữ kho',icon:'📦',thresholds:[2,5,10,20,40],stat:'restocks'},
 {id:'upgrade',name:'Nhà thiết kế thư viện',icon:'🛠️',thresholds:[1,3,6,10,15],stat:'upgrades'},
 {id:'streak',name:'Một ngày tuyệt vời',icon:'🌟',thresholds:[1,3,5,10,20],stat:'perfectDays'}
];
