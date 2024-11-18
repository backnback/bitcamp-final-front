import { useState, useEffect } from 'react';
import axiosInstance from '../components/AxiosInstance';
import { ButtonProvider } from '../components/ButtonProvider';
import { useNavigate } from 'react-router-dom';  // navigate 사용을 위해 추가

function AdminPage() {
    const [user, setUser] = useState([]);
    const [accessToken, setAccessToken] = useState('');
    const navigate = useNavigate();  // navigate 훅을 추가

    useEffect(() => {
        const getUsers = async () => {
            try {
                const token = localStorage.getItem('accessToken');  // 로컬 스토리지에서 토큰 가져오기
                setAccessToken(token);  // 상태에 토큰 저장
                if (!token) {
                    throw new Error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
                }

                const response = await axiosInstance.get('/user/list', {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // 헤더에 토큰 추가
                    },
                });

                setUser(response.data);  // 유저 목록 상태에 저장
            } catch (error) {
                console.error("회원 정보들을 가져오던 중 오류 발생:", error);
            }
        };

        getUsers();  // 컴포넌트가 렌더링될 때 유저 목록을 가져옴
    }, []);  // 빈 배열로 처음 렌더링 시 한 번만 호출

    const deleteUser = async (userId) => {
        console.log(userId);
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                const response = await axiosInstance.post('/user/admindelete', {
                    userId: userId
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.data) {
                    alert("계정을 삭제하였습니다");
                    navigate("/admin");  // 삭제 후 홈으로 이동
                    window.location.reload();  // 페이지 새로고침
                } else {
                    alert("삭제 실패...");
                }
            } catch (error) {
                console.error("회원삭제 중 오류 발생:", error);
                alert("회원삭제 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            }
        } else {
            alert("삭제를 취소합니다");
        }
    };

    return (
        <div>
            <h1>회원 목록</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>이름</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>이메일</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>선택</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((userItem) => (
                        <tr key={userItem.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{userItem.nickname}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{userItem.email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <ButtonProvider>
                                    <button type="button" className="button button__whiteRed" onClick={() => deleteUser(userItem.id)}>
                                        <span className="button__text">삭제하기</span>
                                    </button>
                                </ButtonProvider>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPage;
