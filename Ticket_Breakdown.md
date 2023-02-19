# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Update API interface (3 points)

Assuming that format of this custom is decided, e.g. alphanumeric only.

Add an optional `customId` string property to agent entity type definition that is exposed to client-side (e.g. get/list/update actions).
If architecture requires that, manually update payload type definitions and validation of API endpoints used for creating and updating agents.
Add optional `customAgentId` field to report generation endpoint request type as well.

If deleting `customId` for an agent is desired and API allows partial Agent updates, let's treat empty string as a "delete" action.
Or a separate boolean flag "deleteCustomId". Or a separate endpoint, depending on how things are done around here now.

Backend code will not do anything with this new field yet, but frontend will now be unblocked,
able to use these updated types and work with mocked data (which will be needed for automated tests anyway).

### Implement customId saving and retrieving (3 points)

Add customId field to database layer code and any other layers (even sourcing?) responsible for saving and retrieving it.
Add new column to the table. Optional with a unique constraint.
Should probably be unique in the scope of one facility, not the whole platform.
Make sure unique constraint violation results in an API response that frontend knows how to handle.

### Update getShiftsByFacility (1 point)

Add an optional `agentCustomId` parameter to `getShiftsByFacility` function.
It should already be available in request payload, just not used yet.
To filter shifts by the specified agent we could probably use SQL join,
but let's maintain boundaries between entities in the database layer and resolve agent's `id` by their `customId`
in a separate application layer call. Return an appropriate error if such `customId` does not exist in the given facility.

### Update report PDF rendering (3 points?)

This sounds like it might be needed: Add an optional parameter to `generateReport` function to not repeat some data
in the PDF multiple times since the report is only meant to represent one agent. The parameter could be agent's `id` or maybe all the related metadata.
