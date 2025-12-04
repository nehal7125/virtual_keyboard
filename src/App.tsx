import { useState } from 'react';
import { Input, Card, Space, Typography } from 'antd';
import VirtualKeyboard from './components/VirtualKeyboard';
import './App.css';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

function App() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('');

  const handleKeyPress = (key: string) => {
    setLastKeyPressed(key);
    
    // Handle special keys
    if (key === 'Backspace') {
      setInputValue((prev) => prev.slice(0, -1));
      setTextareaValue((prev) => prev.slice(0, -1));
      return;
    }
    if (key === 'Enter') {
      setInputValue((prev) => prev + '\n');
      setTextareaValue((prev) => prev + '\n');
      return;
    }
    if (key === 'Tab') {
      setInputValue((prev) => prev + '  '); // Two spaces for tab
      setTextareaValue((prev) => prev + '  ');
      return;
    }
    
    // Regular character
    setInputValue((prev) => prev + key);
    setTextareaValue((prev) => prev + key);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <Title level={1}>🌐 Universal Virtual Keyboard</Title>
        <Paragraph>
          Type in any language on any website! This virtual keyboard supports multiple languages
          and can be used to type into any input field on web pages.
        </Paragraph>
      </div>

      <div className="app-content">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Try it out - Type in the input fields below">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <TextArea
                  placeholder="Click here and use the virtual keyboard below to type..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={3}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <Input
                  placeholder="Or type in this input field..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              {lastKeyPressed && (
                <div>
                  <Text type="secondary">Last key pressed: <strong>{lastKeyPressed}</strong></Text>
                </div>
              )}
            </Space>
          </Card>

          <VirtualKeyboard onKeyPress={handleKeyPress} targetWebsite={false} />
        </Space>
      </div>

      <div className="app-footer">
        <Card>
          <Title level={4}>How to use on any website:</Title>
          <Paragraph>
            <ol>
              <li>Install the browser extension (see extension folder)</li>
              <li>Navigate to any website</li>
              <li>Click on any input field</li>
              <li>The virtual keyboard will appear and you can type in any language!</li>
            </ol>
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}

export default App;
