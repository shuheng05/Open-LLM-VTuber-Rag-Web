import React, { useState } from 'react';
import { Button, Card, Col, Drawer, Row, Image } from 'antd';
import Meta from 'antd/es/card/Meta';


// 初始化每个分类的图片
const learningImages = import.meta.glob('./picture-data/learning/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
}) as Record<string, string>;

const lifeImages = import.meta.glob('./picture-data/life/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
}) as Record<string, string>;

const environmentImages = import.meta.glob('./picture-data/environment/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
}) as Record<string, string>;

const transformImages = (modules: Record<string, string>) =>
    Object.entries(modules).map(([path, src]) => {
        const name = path.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/, '') || '';
        return { src, name };
    });

const learningImageList = transformImages(learningImages);
const lifeImageList = transformImages(lifeImages);
const environmentImageList = transformImages(environmentImages);



const PictureDraw: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState<string>('environment');

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    const tabListNoTitle = [
        { key: 'environment', label: '环境类' },
        { key: 'learning', label: '学习类' },
        { key: 'life', label: '生活类' },
        { key: 'vrPanorama', label: 'VR 全景' },
    ];

    const onTabChange = (key: string) => setActiveTabKey(key);

    const renderImageCards = (images: { src: string; name: string }[]) => (
        <Row gutter={[32, 32]}>
            {images.map((img, index) => (
                <Col span={8} key={index}>
                    <Card
                        hoverable
                        variant="outlined"
                        cover={<Image src={img.src} style={{ height: 150, objectFit: 'cover' }} />}
                    >
                        <Meta description={img.name} />
                    </Card>
                </Col>
            ))}
        </Row>
    );

    const contentListNoTitle: Record<string, React.ReactNode> = {
        learning: renderImageCards(learningImageList),
        life: renderImageCards(lifeImageList),
        environment: renderImageCards(environmentImageList),
        vrPanorama: (
            <iframe
                src="https://www.720yun.com/t/b2b2ajskula?scene_id=449742"
                width="100%"
                height="700px"
                allowFullScreen
            />
        ),
    };


    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                picture
            </Button>
            <Drawer title="school picture" onClose={onClose} open={open} size="large">
                <Card
                    style={{ width: '100%' }}
                    tabList={tabListNoTitle}
                    activeTabKey={activeTabKey}
                    onTabChange={onTabChange}
                    tabProps={{ size: 'middle' }}
                >
                    {contentListNoTitle[activeTabKey]}
                </Card>
            </Drawer>
        </>
    );
};

export default PictureDraw;
