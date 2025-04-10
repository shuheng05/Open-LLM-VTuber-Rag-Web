import React, {useState} from 'react';
import {Button, Drawer, Modal} from "antd";

const VannaAI: React.FC = () => {


    // 抽屉
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
        showModal()
    };

    const onClose = () => {
        setOpen(false);
    };

    // Modal 对话框
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                SQL AI
            </Button>
            <Drawer
                title="SQL-AI"
                onClose={onClose}
                open={open}
                width="80%"
                // size="large"
            >
                <iframe
                    src="http://localhost:8084" // 替换为你的 Vanna Web 地址
                    width="100%"
                    height="700px"
                    title="SQL AI"
                    frameBorder="0" // React 中需用 camelCase
                    allowFullScreen
                />

            </Drawer>
            <Modal title="SQl AI 使用场景" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>如果你更喜欢以图表的方式来展示结果，你可以使用SQL AI 哦</p>
            </Modal>
        </>
    );
};

export default VannaAI;
