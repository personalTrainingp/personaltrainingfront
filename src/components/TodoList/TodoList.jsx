import { Row, Col, Card, Button } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import { CardTitle, Form, TextInput } from '@/components';
import useTodoList, { todoSchema } from './useTodoList';

const TodoList = ({ addTodo, height }) => {

	const {
		todoData,
		archiveTodos,
		toggleTodo,
		saveTodo,
		getInprogressTodos,
	} = useTodoList();

	return (
		<Card>
			<Card.Body className="pb-0">
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-2"
					title="ToDo"
					menuItems={[{ label: 'Settings' }, { label: 'Action' }]}
				/>
			</Card.Body>
			<div className="todoapp">
				<Card.Body className="p-0">
					{addTodo && (
						<Row className="px-3">
							<Col>
								<h5 id="todo-message">
									<span id="todo-remaining">{getInprogressTodos().length}&nbsp;</span>
									of <span id="todo-total">{todoData.length}</span> remaining
								</h5>
							</Col>
							<Col className="col-auto">
								<Button
									className="float-end btn-sm"
									variant="light"
									id="btn-archive"
									onClick={archiveTodos}
								>
									Archive
								</Button>
							</Col>
						</Row>
					)}

					<Row>
						<Col>
							<SimpleBar className="px-3" style={{ maxHeight: height }}>
								<ul
									className="list-group list-group-flush todo-list"
									id="todo-list"
								>
									{todoData.map((todo, index) => {
										return (
											<li
												key={index.toString()}
												className="list-group-item border-0 ps-0"
											>
												<div className="form-check mb-0">
													<input
														type="checkbox"
														className="form-check-input todo-done"
														id={todo.id.toString()}
														checked={todo.done}
														onChange={() => toggleTodo(todo, index)}
													/>
													<label
														className="form-check-label"
														htmlFor={todo.id.toString()}
													>
														{todo.done ? <s>{todo.text}</s> : todo.text}
													</label>
												</div>
											</li>
										);
									})}
								</ul>
							</SimpleBar>
						</Col>
					</Row>

					{addTodo && (
						<Row>
							<Col>
								<Form
									name="todo-form"
									id="todo-form"
									onSubmit={saveTodo}
									schema={todoSchema}
									className="needs-validation mx-3 mb-3"
								>
									<Row>
										<Col>
											<TextInput
												type="text"
												name="newTodo"
												className="form-control"
												placeholder="Add new todo"
												key="newTodo"
											/>
										</Col>
										<Col className="col-auto">
											<button
												type="submit"
												className="btn btn-primary waves-effect waves-light"
											>
												Add
											</button>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					)}
				</Card.Body>
			</div>
		</Card>
	);
};

export default TodoList;
