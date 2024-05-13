import { FloatButton, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderPage from './HeaderPage';
import SiderPage from './SiderPage';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
// import { store } from '../app/store';
import '../App.css';

const { Content } = Layout;

const FixedLayout: React.FC = () => {
    const currentPage = useSelector((state: RootState) => state.page.currentPage);

    const [collapse, setcollapse] = useState(false);

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <SiderPage collapse={collapse} />
                <Layout className="site-layout bg-white">
                    <HeaderPage collapse={collapse} setcollapse={setcollapse} currentPage={currentPage} />
                    <Content style={{ margin: '0 10px', marginTop: 10 }}>
                        <div>
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
                <FloatButton.BackTop className="hover:bg-[#4679fb] " />
            </Layout>

            {/*  <div
                className="w-full "
                style={
                    {
                        // overflow: 'auto',
                        //height: '100vh',
                        // overflowY: 'hidden',
                    }
                }
            >
                <Layout className="w-full ">
                    <Header_page />
                    <Layout>
                        <Sider_page />
                        <Content className="bg-gray-50 mt-16 p-10">
                            <Outlet />
                        </Content>
                    </Layout>
                    <FloatButton.BackTop />
                </Layout>
            </div>
            
            ------------------------------------------------------------------
            //demo for styling purposes

            <Layout style={{ minHeight: '100vh' }}>
                <Header_page />
            <Layout className="site-layout">
            <Sider_page />
                <Content style={{ margin: '0 16px', marginTop: 16 }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout> 
            
            */}
        </>
    );
};

export default FixedLayout;
