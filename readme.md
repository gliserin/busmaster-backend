회원가입
[POST] /api/user/signup
name: string
id: string
password: string

로그인
[POST] /api/user/login
id: string
password: string

로그아웃
[POST] /api/user/logout

자동로그인 체크
[GET] /api/user/check

탈퇴
[POST] /api/user/resign
id: string

목록조회
[GET] /api/bus

최근 n개 목록 조회
[GET] /api/bus/recent

등록
[POST] /api/bus
location: string
route: string
number: string
type: string
year: string

수정
[PUT] /api/bus/{id}
location: string
route: string
number: string
type: string
year: string

삭제
[DELETE] /api/bus/{id}

내가 등록한 버스 개수
[GET] /dashboard/mybuscount

나의 등수
[GET] /dashboard/myplace

사용자 순위
[GET] /dashboard/ranking
