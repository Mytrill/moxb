import { Action, Bind, OneOf } from '@moxb/moxb';
import { Button, Tooltip } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { TooltipProps } from 'antd/lib/tooltip';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ReactElement } from 'react';
import { BindMarkdownDiv } from './LabelAnt';

function toolTipText(action: Bind | Action) {
    let shortcuts = '';
    if ((action as Action).keyboardShortcuts) {
        shortcuts = (action as Action).keyboardShortcuts.map(s => '(**' + s + '**)').join('\n\n');
    }
    return (action.label || action.help || '') + (shortcuts && '\n\n' + shortcuts);
}

export interface BindToolTipAntProps extends TooltipProps {
    operation?: Bind | Action | OneOf;
    icon?: string;
    text?: string;
    type?: ButtonType;
}

@observer
export class ToolTipAnt extends React.Component<BindToolTipAntProps> {
    render() {
        const { operation, children, placement, ...props } = this.props;
        if (!operation) {
            return children;
        }
        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child as ReactElement<any>, { operation, ...props })
        );
        if (operation.disabled) {
            return <>{childrenWithProps}</>;
        } else {
            return (
                <Tooltip placement={placement || 'top'} title={<BindMarkdownDiv text={toolTipText(operation)} />}>
                    {childrenWithProps}
                </Tooltip>
            );
        }
    }
}

@observer
export class ToolTipButton extends React.Component<BindToolTipAntProps> {
    render() {
        const { operation, icon, text, type } = this.props;
        const selectedType = operation!.customData ? 'dashed' : 'ghost';
        if (operation!.disabled) {
            return (
                <Button
                    type={type || selectedType}
                    onClick={(operation as Action).fire}
                    disabled={operation!.disabled}
                    htmlType="button"
                    icon={icon}
                >
                    {text}
                </Button>
            );
        } else {
            return (
                <ToolTipAnt operation={operation}>
                    <Button
                        type={type || selectedType}
                        onClick={(operation as Action).fire}
                        disabled={operation!.disabled}
                        htmlType="button"
                        icon={icon}
                    >
                        {text}
                    </Button>
                </ToolTipAnt>
            );
        }
    }
}
