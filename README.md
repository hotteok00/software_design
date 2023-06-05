# software_design
월별, 주별, 일별, 가계부

## 실행 환경 설정
- node.js	: https://nodejs.org/ko/download 에서 Windows installer 다운로드 및 설치

- mysql		: https://dev.mysql.com/downloads/mysql/ 에서 Windows (x86, 64-bit), ZIP Archive 다운로드 및 설치
		  비밀번호는 0000으로 설정
		   설치된 MySQL 8.0 Command Line Client 실행 및 비밀번호 입력 - 0000
		  
		  *** database/my_db_account.sql import 필요 ***
		  설치된 MySQL Workbench 실행, Local instance MySQL 접속 (비밀번호 입력 - 0000)
		  화면 좌측 Data Import/Restore 클릭
		  Import from self contained file 선택, 파일 경로 찾아서 설정
		  Default Target Schema = my_db 로 설정
		  상단 Import Progress 선택, 하단 start import 실행
			
- modules	: 제출한 소스코드 디렉토리에서
		  npm install
		  npm update


## 프로그램 실행
1. server 실행  : node ./src/database.js
2. client 실행  : calendar.html 실행
