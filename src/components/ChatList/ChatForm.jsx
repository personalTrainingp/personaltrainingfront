import { Row, Col } from 'react-bootstrap';
import { Form, TextInput } from '@/components';
import { chatMessageSchema } from './hooks/useChatList';

const ChatForm = ({ onNewMessagesPosted }) => {

  return (

    <Form
      name="chat-form"
      id="chat-form"
      onSubmit={onNewMessagesPosted}
      schema={chatMessageSchema}
      className="needs-validation m-3"
    >
      <Row>
        <Col>
          <TextInput
            name="message"
            type="text"
            className="form-control chat-input"
            placeholder="Enter your text"
            key="message"
          />
        </Col>
        <Col className="col-auto">
          <button
            type="submit"
            className="btn btn-danger chat-send waves-effect waves-light"
          >
            Send
          </button>
        </Col>
      </Row>
    </Form>
  )
};

export default ChatForm;

// <form
// 	name="chat-form"
// 	id="chat-form"
// 	onSubmit={handleSubmit((value) => handleValidMessageSubmit(value, onNewMessagesPosted))}
// 	className="needs-validation m-3"
// >
// 	<Row>
// 		<Col>
// 			<TextInput
// 				name="newMessage"
// 				type="text"
// 				className="form-control chat-input"
// 				placeholder="Enter your text"
// 				register={register}
// 				key="newMessage"
// 				errors={errors}
// 				control={control}
// 			/>
// 		</Col>
// 		<Col className="col-auto">
// 			<button
// 				type="submit"
// 				className="btn btn-danger chat-send waves-effect waves-light"
// 			>
// 				Send
// 			</button>
// 		</Col>
// 	</Row>
// </form>