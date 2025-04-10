import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Drawer, Row, message } from 'antd';

interface Voice {
    title: string;
    file: string;
    ref_audio_path: string;
    prompt_text: string;
    audio_url?: string;
    gpt_weights: string;
    sovits_weights: string;
}

const ChangeSpeech: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [voices, setVoices] = useState<Voice[]>([]);

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    useEffect(() => {
        fetch('/audio-data/list.json')
            .then(res => res.json())
            .then((data: Voice[]) => {
                const withUrls = data.map(item => ({
                    ...item,
                    audio_url: `/audio-data/${item.file}`
                }));
                setVoices(withUrls);
            })
            .catch(err => {
                console.error('加载音频列表失败:', err);
                message.error('音频列表加载失败');
            });
    }, []);

    const handleCardClick = async (voice: Voice) => {
        try {
            const { ref_audio_path, prompt_text, gpt_weights, sovits_weights } = voice;

            const updateConfig = fetch('/api/update-gpt-sovits-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ref_audio_path, prompt_text })
            });

            const gptWeights = fetch(
                `/voice/set_gpt_weights?weights_path=${encodeURIComponent(gpt_weights)}`,
                { method: 'GET', headers: { Accept: 'application/json' } }
            );

            const sovitsWeights = fetch(
                `/voice/set_sovits_weights?weights_path=${encodeURIComponent(sovits_weights)}`,
                { method: 'GET', headers: { Accept: 'application/json' } }
            );

            const referAudio = fetch(
                `/voice/set_refer_audio?refer_audio_path=${encodeURIComponent(ref_audio_path)}`,
                { method: 'GET', headers: { Accept: 'application/json' } }
            );

            const [res1, res2, res3, res4] = await Promise.all([
                updateConfig,
                gptWeights,
                sovitsWeights,
                referAudio
            ]);

            if (!res1.ok || !res2.ok || !res3.ok || !res4.ok) {
                throw new Error('部分请求失败');
            }

            message.success('语音配置切换成功！');
        } catch (error) {
            console.error(error);
            message.error('语音配置失败');
        }
    };


    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                Select your favourite voice
            </Button>
            <Drawer title="Select your favourite voice" onClose={onClose} open={open} width='80%'>
                <Row gutter={[32, 32]}>
                    {voices.map((voice, index) => (
                        <Col span={8} key={index}>
                            <Card
                                title={voice.title}
                                hoverable
                                style={{ width: '100%' }}
                                actions={[<Button type="primary"
                                                  onClick={() => handleCardClick(voice)}
                                >
                                    切换为该语音
                                </Button>]}
                            >
                                <audio controls src={voice.audio_url} style={{ width: '100%' }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Drawer>
        </>
    );
};

export default ChangeSpeech;
