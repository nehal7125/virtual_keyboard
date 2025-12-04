import { useState, useEffect, useCallback } from 'react';
import { Button, Select, Space, Card } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { keyboardLayouts } from '../data/layouts';
import type { SupportedLanguage } from '../types/keyboard';
import { getFocusedInput, insertTextAtCursor, deleteBeforeCursor, simulateKeyPress } from '../utils/keyboardInput';
import './VirtualKeyboard.css';

const { Option } = Select;

interface VirtualKeyboardProps {
  onKeyPress?: (key: string) => void;
  targetWebsite?: boolean; // If true, will try to type into focused inputs on the page
}

export default function VirtualKeyboard({ onKeyPress, targetWebsite = false }: VirtualKeyboardProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [shiftPressed, setShiftPressed] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const layout = keyboardLayouts[currentLanguage];
  const languages = Object.values(keyboardLayouts);

  const handleKeyClick = useCallback((keyLayout: { key: string; display: string; shiftDisplay?: string; code?: string; type?: string }) => {
    const { key, display, shiftDisplay, code, type } = keyLayout;

    // Handle special keys
    if (type === 'special') {
      if (key === 'Backspace') {
        if (targetWebsite) {
          const target = getFocusedInput();
          if (target) {
            deleteBeforeCursor(target);
          }
        }
        onKeyPress?.('Backspace');
        return;
      }
      if (key === 'Enter') {
        if (targetWebsite && code) {
          const target = getFocusedInput();
          if (target) {
            simulateKeyPress('Enter', code, target);
          }
        }
        onKeyPress?.('Enter');
        return;
      }
      if (key === 'Tab') {
        if (targetWebsite && code) {
          const target = getFocusedInput();
          if (target) {
            simulateKeyPress('Tab', code, target);
          }
        }
        onKeyPress?.('Tab');
        return;
      }
      if (key === ' ') {
        // Space key
        const spaceChar = ' ';
        if (targetWebsite) {
          const target = getFocusedInput();
          if (target) {
            insertTextAtCursor(spaceChar, target);
          }
        }
        onKeyPress?.(spaceChar);
        return;
      }
    }

    // Handle modifier keys
    if (type === 'modifier') {
      if (key === 'Shift') {
        setShiftPressed((prev) => !prev);
        return;
      }
      if (key === 'CapsLock') {
        setCapsLock((prev) => !prev);
        return;
      }
      // Ctrl and Alt are handled but don't do anything special for now
      return;
    }

    // Handle normal character keys
    // Always use the display character (which shows the language-specific character)
    // The 'key' property is just the English key code, 'display' is what we want to type
    let charToInsert = display;
    
    // Apply shift - use shiftDisplay if available, otherwise use display
    if ((shiftPressed || capsLock) && shiftDisplay) {
      charToInsert = shiftDisplay;
    }

    // Insert the character
    if (targetWebsite) {
      const target = getFocusedInput();
      if (target) {
        insertTextAtCursor(charToInsert, target);
      }
    }
    
    // Always send the display character, not the key code
    onKeyPress?.(charToInsert);
  }, [shiftPressed, capsLock, targetWebsite, onKeyPress]);

  const handleKeyDown = useCallback((keyLayout: { key: string; code?: string }) => {
    setPressedKeys((prev) => new Set(prev).add(keyLayout.key));
  }, []);

  const handleKeyUp = useCallback((keyLayout: { key: string }) => {
    setPressedKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(keyLayout.key);
      return newSet;
    });
    
    // Auto-release shift after key press
    if (keyLayout.key === 'Shift') {
      setTimeout(() => setShiftPressed(false), 100);
    }
  }, []);

  // Handle physical keyboard input (optional enhancement)
  useEffect(() => {
    if (!targetWebsite) return;

    const handlePhysicalKeyPress = () => {
      // Allow normal typing, but we can intercept if needed
      // For now, we'll let physical keyboard work normally
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [targetWebsite]);

  return (
    <Card className="virtual-keyboard-container" title={
      <Space>
        <GlobalOutlined />
        <span>Virtual Keyboard</span>
        <Select
          value={currentLanguage}
          onChange={(value) => setCurrentLanguage(value)}
          style={{ width: 200 }}
          suffixIcon={<GlobalOutlined />}
        >
          {languages.map((lang) => (
            <Option key={lang.code} value={lang.code}>
              {lang.name}
            </Option>
          ))}
        </Select>
      </Space>
    }>
      <div className="keyboard-wrapper">
        {layout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyLayout, keyIndex) => {
              const isPressed = pressedKeys.has(keyLayout.key);
              const isModifier = keyLayout.type === 'modifier';
              const isSpecial = keyLayout.type === 'special';
              const width = keyLayout.width || 1;
              
              // Determine which character to display based on shift state
              const displayChar = (shiftPressed || capsLock) && keyLayout.shiftDisplay 
                ? keyLayout.shiftDisplay 
                : keyLayout.display;
              
              return (
                <Button
                  key={`${rowIndex}-${keyIndex}`}
                  className={`keyboard-key ${
                    isPressed ? 'pressed' : ''
                  } ${isModifier ? 'modifier' : ''} ${isSpecial ? 'special' : ''} ${
                    (shiftPressed || capsLock) && keyLayout.shiftDisplay ? 'shift-active' : ''
                  }`}
                  style={{
                    flex: width,
                    minWidth: `${width * 50}px`,
                    height: '60px',
                    fontSize: keyLayout.key === ' ' ? '14px' : '16px',
                    fontWeight: isModifier ? 'bold' : 'normal',
                  }}
                  onClick={() => handleKeyClick(keyLayout)}
                  onMouseDown={() => handleKeyDown(keyLayout)}
                  onMouseUp={() => handleKeyUp(keyLayout)}
                  onMouseLeave={() => handleKeyUp(keyLayout)}
                >
                  {displayChar}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
      
      {targetWebsite && (
        <div className="keyboard-status">
          <p className="text-sm text-gray-500 mt-4">
            Click on any input field on this page, then use the virtual keyboard to type.
          </p>
        </div>
      )}
    </Card>
  );
}

