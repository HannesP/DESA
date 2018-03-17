## Goal
Create a prototype for a declarative event sourced application.

- Enable declarative, non-technical business logic
- Enable graphical UI to explore and monitor business
- Try a different approach in business modelling

## Not goal
Create something that will be able to handle all business situations

## Notes
Conceptual limitation: only one entity type per event/command/selector

### How do do mapping?

The goal is to enable enable full chaining of e.g. SubmitPost -> PostSubmitted "tacitly". That requires that the parameters be mapped automatically, e.g.

    {SubmitPost | post: '123', body: 'my post', user: '321'}

to

	{PostSubmitted | post: '123', body: 'my post', user: '321'}

given the command and event definitions. In this simple example, full forwarding of the params would suffice. However, we also want it for prerequisite selectors, with only a subset of the parameters, e.g.

	{SubmitPost | post: '123', body: 'my post', user: '321'}

to

	{PostDoesNotExist | post: '123'}
	{UserCanSubmitPost | user: '321'}
	{PostBodyIsValid | body: 'my post'}