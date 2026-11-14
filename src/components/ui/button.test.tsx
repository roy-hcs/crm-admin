import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/utils/render';
import { Button } from './button';

/**
 * P0 示例用例（RTL 渲染，REACT-TEST-INFRA-CHECKLIST.md §5）。
 * 目标：验证 renderWithProviders + jsdom + setup 链路可用；
 * Button 为零请求组件，不触发 MSW 未声明请求。
 */
describe('Button（P0 RTL 渲染示例）', () => {
  it('渲染为按钮并显示文案', () => {
    renderWithProviders(<Button data-testid="p0-example-button">保存</Button>);

    const btn = screen.getByTestId('p0-example-button');
    // assert: 守护公共基础件回归网（react-test-plan.md §3 公共组件护栏）——
    // 渲染 DOM 状态可观测：元素存在、文案正确、data-slot 属性未被回归破坏
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('保存');
    expect(btn).toHaveAttribute('data-slot', 'button');
  });
});
