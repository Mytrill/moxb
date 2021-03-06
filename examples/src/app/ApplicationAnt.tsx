import {
    ActionButtonAnt,
    ActionFormButtonAnt,
    ActionSpanAnt,
    BoolAnt,
    ConfirmAnt,
    DatePickerAnt,
    LabelAnt,
    LabelMarkdownAnt,
    ManyOfAnt,
    ManyOfCheckboxAnt,
    ModalAnt,
    NumericFormAnt,
    OneOfAnt,
    OneOfButtonFormAnt,
    OneOfSelectAnt,
    TableAnt,
    TagAnt,
    TextAnt,
    TextFormAnt,
    TimePickerAnt,
    ActionToggleButtonAnt,
    ToolTipButton,
} from '@moxb/antd';
import { toJSON } from '@moxb/moxb';
import { Col, Dropdown, Form, Icon, Menu, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Application } from './Application';

// helper function to print recursive mobx trees
(window as any).js = function(value: any, ignore = /\b(store|storage)\b/) {
    return toJSON(value, ignore);
};

@inject('app')
@observer
export class ApplicationAnt extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app!;
        return (
            <Row>
                <Col span={16}>
                    <section
                        style={{
                            border: '1px solid #ebedf0',
                            padding: '42px 24px 50px',
                            color: 'rgba(0,0,0,.65)',
                        }}
                    >
                        <Form>
                            <h1>Ant design Components</h1>
                            <hr />
                            <LabelMarkdownAnt operation={application.testLabelMarkdown} />
                            <LabelAnt operation={application.testLabel} />
                            <ActionButtonAnt
                                id="application.test.impl.testButton1"
                                type="primary"
                                operation={application.testAction}
                            />
                            <br />
                            <br />
                            <h3>ActionFormButtonUI Component</h3>
                            <ActionFormButtonAnt type="primary" operation={application.testAction} />
                            <br />
                            <br />
                            <h3>ActionToggleButtonUI Component</h3>
                            <ActionToggleButtonAnt
                                id="application.test.impl.toggleButton"
                                backgroundColor="#FFFFFF"
                                labelColor="#003f54"
                                operation={application.testBool}
                            />
                            <h3>TooltipButton Component</h3>
                            <ToolTipButton type="primary" operation={application.testAction} text={'Label'} />
                            <br />
                            <br />
                            <br />
                            <br />
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item>1st menu item</Menu.Item>
                                        <Menu.Item>
                                            <ActionSpanAnt operation={application.testAction} />
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <a className="ant-dropdown-link" href="#">
                                    Dropdown menu <Icon type="down" />
                                </a>
                            </Dropdown>
                            <br />
                            <br />
                            <h3>BoolUI Component</h3>
                            <BoolAnt operation={application.testBool} />
                            {application.showCheckbox && (
                                <p>
                                    <br />
                                    Additional text is visible now!
                                </p>
                            )}
                            <br />
                            <h3>ConfirmUI Component</h3>
                            <ConfirmAnt operation={application.testConfirm} />
                            <ActionButtonAnt operation={application.newConfirmAction()} />
                            <br />
                            <br />
                            <h3>ModalAnt Component</h3>
                            <ActionButtonAnt color="green" operation={application.newModalAction()} />
                            <ModalAnt operation={application.testModal}>
                                <TextFormAnt operation={application.testText} />
                            </ModalAnt>
                            <br />
                            <br />
                            <h3>TextAnt - Input Component</h3>
                            <TextAnt id={application.testTextfield + '-1'} operation={application.testTextfield} />
                            <br />
                            <br />
                            <h3>TextAnt - Password Input Component</h3>
                            <TextAnt type="password" operation={application.testTextfield} />
                            <br />
                            <br />
                            <h3>TextAnt - Textarea Component</h3>
                            <TextAnt operation={application.testTextarea} />
                            <br />
                            <br />
                            <h3>NumericAnt Component</h3>
                            <NumericFormAnt operation={application.testNumeric} />
                            <br />
                            <br />
                            <h3>TagAnt Component</h3>
                            <TagAnt operation={application.testTags} tagColor="#87d068" newItemLabel={'tstst'} />
                            <br />
                            <br />
                            <h3>ManyOfAnt Component</h3>
                            <ManyOfAnt style={{ width: '200px' }} operation={application.testManyOf} />
                            <br />
                            <br />
                            <h3>ManyOfAnt Component - multiple selection</h3>
                            <ManyOfAnt style={{ width: '200px' }} mode="multiple" operation={application.testManyOf} />
                            <br />
                            <br />
                            <h3>ManyOfCheckboxAnt Component - multiple selection with checkboxes</h3>
                            <ManyOfCheckboxAnt style={{ width: '200px' }} operation={application.testManyOf} />
                            <br />
                            <br />
                            <h3>OneOf - RadioButton Component</h3>
                            <OneOfAnt operation={application.testOfOne} />
                            <br />
                            <br />
                            <h3>OneOf - RadioButton solid Component</h3>
                            <OneOfButtonFormAnt buttonStyle="solid" operation={application.testOfOne} />
                            <br />
                            <br /> <h3>OneOf - Select Component</h3>
                            <OneOfSelectAnt operation={application.testOfOne} />
                            <br />
                            <br />
                            <h3>DatePicker Component</h3>
                            <DatePickerAnt operation={application.testDate} />
                            <br />
                            <br />
                            <h3>TimePicker Component</h3>
                            <TimePickerAnt operation={application.testTime} />
                            <br />
                            <br />
                            <hr />
                            <h3>Table Component</h3>
                            <TableAnt table={application.testTable} />
                            <br />
                            <div id="spacer" style={{ paddingBottom: '100px' }} />
                        </Form>
                    </section>
                </Col>
            </Row>
        );
    }
}
