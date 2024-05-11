// import { Spin } from 'antd';
// import { MdLocalShipping } from 'react-icons/md';
// import '../App.css';

// const Loader = () => {
//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-200">
//             <div className="  flex flex-col items-center">
//                 <Spin
//                     size="large"
//                     tip="Loading..."
//                     indicator={
//                         <div className="animate-truck">
//                             <MdLocalShipping className="text-6xl text-blue-500" />
//                         </div>
//                     }
//                 />
//                 <h2 className="text-3xl font-bold text-gray-800 mt-4">Mighty Mover</h2>
//             </div>
//         </div>
//     );
// };

// export default Loader;
import { Spin } from 'antd';
import { MdLocalShipping } from 'react-icons/md';
import '../App.css';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="flex flex-col items-center p-8 rounded-lg ">
                <div className="animate-truck ">
                    <Spin
                        size="large"
                        tip="Loading..."
                        indicator={
                            <>
                                <div className="text-6xl text-blue-500 mr-8">
                                    <MdLocalShipping />
                                </div>
                            </>
                        }
                    />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Mighty Mover</h2>
                <p className="text-xl text-gray-600">Bringing the future of logistics to you!</p>
            </div>
        </div>
    );
};

export default Loader;
