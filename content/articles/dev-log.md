---
title: "Dev Log"
created_at: "2024-08-16"
tags:
  - "journal"
summary: "A log of my daily coding activities."
author: "JT Houk"
location: "Montreal"

---

> "The unexamined life is not worth living." - Socrates

## Stardate 2024-12-17

- Town hall
- Post mortem for discount stack issue
- Code review
- QA Sylvie ticket

## Stardate 2024-12-09

- Investigating ecom cannabinoid lots from sold lots
- Register endpoint
- Partial compliance report MB
- Fixed auto discounts after 0 utc

## Stardate 2024-11-21

- Reviewed Yongmin and Sylvie's work
- Performance testing for customerCount changes
- Released lotmetadata performance changes
  - Monitoring for performance in new relic


## Stardate 2024-11-20

- Helped yongmin with infra deploy issue
- deployed tickets
- architecture
  - talked about otel possibilities

## Stardate 2024-11-19

- Luiz, nick reviews
- Updating location cannabinoid behavior
- epic breakdown, 1/1
- testing bug ticket
- removing customer count code

## Stardate 2024-11-13

- Jheysson help with gift cards
- Yongmin help with transactions
- Marcos 1/1
- Testing ticket

## Stardate 2024-11-12

- merrco gift card investigation
- on call rotation
- fire alarm response (revert trx pr)

## Stardate 2024-11-08

- fixing customerCount query index
- discussion on lot metadata
- ecom fb discussion

## Stardate 2024-11-05

- Help Yongmin deployment
- Investigated gift cards with ecom
- Yongmin review

## Stardate 2024-11-01

- Create ticket for destroying stacks

## Stardate 2024-10-31

- Fix hanging stacks
- Investigate ecom service error

## Stardate 2024-10-28

- Sylvie bug ticket
- Luiz deleted users
- 1/1
- failpoint

## Stardate 2024-10-24

- Code reviews
- Performance testing

## Stardate 2024-10-22

- SMS phone config
- QA role for pinpoint
- Performance testing external products

## Stardate 2024-10-10

- Lot metadata design session
  - How was external products endpoint identified? Why not external prevalidation?
  - Related to paid external sales removing inventory from newest lot issue?
  - Related to system review slow queries?
  - Relate tickets to investigations
  - Who's using which version of the API?

## Stardate 2024-10-09

- Yongmin review
- Prioritizing system review tickets
- Helped Nick with auth issues in sandbox
- Luiz support customer
- NOTE: update snapshot update method

## Stardate 2024-10-08

- Yongmin reviews (biguns)
- Fixed ticket deployment
- Talked with Luiz about lot metadata
  - diff between lot and batch?
  - how to handle fifo queue?
- Sylvie ecom config help

## Stardate 2024-10-07

- Getting up to speed on messages
- Reviewing snapshot work & performance changes
- Reviewing hackathon work
- Plan lotmetadata work

## Stardate 2024-09-20

- Luiz help with passing on snapshot work and ocs help
- Sylvie help with hackathon webhooks
- Nick help with cube FB

## Stardate 2024-09-17

- Byeong Peter architecture
- Analyzed audit data for best time to take down
- Worked on FF
- OCS meeting
- Review snapshots plan
- max -connections

## Stardate 2024-09-16

- Tested Tiago's ticket

## Stardate 2024-09-13

- Devops priority meeting
- Byeong compliance issues stack
- Amandeep honeypot investigation
- Devops should allow read access to dev support
- Testing snapshot records

## Stardate 2024-09-11

- vscode env issue
- yongmin help
- audit issue
- Nicholas help pipeline

## Stardate 2024-09-10

- Helped Sylvie with connecting to sandbox
- Estimated tickets for KML delivery zones
- trouble with dev server
- verified ocs sandbox flow
- architecture meeting

## Stardate 2024-09-09

- Luiz issues with product import
- Sylvie connect sandbox
- Byeong pipeline issue

### Compliance issues

- Met with Byeong to talk about platform compliance issues

### Inventory snapshots

- Demoed cancel endpoint

### KML delivery zones

- Estimated tickets

## Stardate 2024-09-06

### Inventory snapshots

- Tested complete endpoint
- Fixed test suite
- Completed cancel endpoint

### Code reviews

- Yongmin transaction changes failing tests
- Sylvie

### Dev support

- Helped Sylvie with a query to find problem product data

## Stardate 2024-09-05

### Code reviews

- Yongmin transaction changes

### System review

- Discussed degrading Apdex scores and the implications for our system

### Inventory snapshots

- Fixed tests for deleting snapshots
- Added transactions to queries

## Stardate 2024-09-04

### Inventory snapshots

- Released sync-quantites endpoint changes

### Design session

- Helped Yongmin debug an issue with transactions impacting audit tests

### Code reviews

- Luiz auto loyalty
- Yongmin
- Tiago MB compliance
- yongmin audit tests globals

## Stardate 2024-09-03

### Architecture meeting

- Discussed surcharge

### Post Mortem

- Discussed incident with destroyed web distribution

### Sales channels

- Discussed how parked sales should apply discounts at time of payment

### Investigations

- Looked into fixing Flint & Embers removed tax group

## Stardate 2024-08-30

### Hotfixes

- Helped Jheysson with product price export query scaling issues
- Fixed ON compliance manual reports retry issue

### Code reviews

- Luiz external auto discount loyalty

## Stardate 2024-08-29

### Investigations

- Investigated OCS submissions not matching inventory movements for Ganjika House

### Inventory snapshots

- Finished code for resync snapshots
- Demoed changes in feature branch
- Tested performance in sandbox

## Stardate 2024-08-28

### Inventory snapshots

- Released post snapshots endpoint

### Design session

- Helped Yongmin investigate mysql transactions affecting test performance

## Stardate 2024-08-27

### Ignite talks

- Researched and discussed MySQL geospatial data types and querying

### KML delivery zones

- Discussed functionality of KML delivery zone feature

### Inventory snapshots

- Finished performance testing in sandbox
- Finished coding resync changes and moved to review

## Stardate 2024-08-26

### Compliance issues

- Worked with Byeong to coordinate US integration with our Compliance issues service

### Code reviews

- Sylvie's work on admin product import tool
- Yongmin's work adding transactions to batch inventory queries

### Inventory snapshots

- Added newrelic segment monitoring to snapshot queries
- Performance testing queries in sandbox
- Deployed UI changes to handle missing product inventory

### Weekly 1/1 with Peter

- Discussed balancing the growing roles and responsibilities left by the departure of the chief architect
- Recommended plan of action against OCS for their lack of communication and cooperation in retailer compliance issues

## Stardate 2024-08-23

### System review

- Discussed the Budvue usage spike and how to handle it
  - We are reducing our burst rate to 1000

### Inventory snapshots

- Fixed issue with case statements
- Tested in feature branch
- Moved to code review

## Stardate 2024-08-22

### KML delivery zones epic breakdown

- Discussed the scope of the KML delivery zones epic
- Went over time because of overlooked design considerations
- Will need to follow up with Ecom on whether we need to validate addresses against zones in the pre-validation step
- Researched geospatial data types in mysql

### US products service meeting

- Discussed the need for a new service to handle product data for US
  - Leaning towards integrating with Canada's product service to best utilize limited dev resources
  - Will need to address some concerns about folding in US data with Canada's
    - Performance
    - Bulk updating (abusive product calls)
    - Event consumer writing to MySQL
    - Building out foreign keys
    - Authorization from US

### Investigations

- Continued talks with Budvue about their integration issues
  - They configured their queue to call us at 750 RPS but their integration is set to 600
  - We might need to downgrade their integration depending on their burst rate (currently capped at 5k)

## Stardate 2024-08-21

### Leads Meeting

- Discussed stability concerns and how to improve observability of maintenance tasks in priority of feature development

### Architecture Meeting

- Discussed the scope of KML based delivery zones

### Investigations

- WooCommerce integration failing for Prairie Cannabis
  - Their IT thinks it's an IP filter but found authorization errors in the logs so it's likely a token issue
- Ran inventory submissions for Ganjika House from July

## Stardate 2024-08-20

### Custom fields product import / export meeting

- Discussed the options for custom fields in the product import / export process
- Recommended treating any unknown columns in csv as custom fields

### Inventory Snapshots

- Removed updating batch inventory on audit update
- Fixed batch related tests and tested deployment

## Stardate 2024-08-16

### Team Retro

Today during our retro we discussed ways to address fail points in our tickets.
We decided to walk through our QA checklist in the demo videos before moving to "Ready for test",
as well as documenting AC from our epic breakdowns in a document that we can reference when picking up tickets.

We also discussed the need for more platform-wide collaboration so we will be more active in asking developers in #architecture
for input on how our work will impact them and vice versa. I will also be more proactive in reaching out to other team leads
before we start work on a new epic to consider the impact and scope of our work.

### Delivery Zones

I need to collaborate with Ecom and US to ask some questions:

- Will Ecom send us a full address or can they convert to coordinates?
  - If we must convert to coordinates, should we make a platform service to handle this?
- Should we make a new platform service to store coordinate-based delivery zones?

### Investigating missing lot inventory

- Helped Yongmin with a query to find missing inventory

## Notes

- Do I get birthday off?

### Topics

- Alarms
- Customer count query improved
- Increased instance sizes
- Yongmin KML challenges and successes

### System improvements

- Inventory snapshots
  - We needed to remove historical data since the data was growing exponentially and is just unsustainable
  - Performance improvements were focused on filtering data on creating new snapshots

#### Naming discrepancies

There are differences in how certain things are named in the UI vs in our data and code.
The effect of this is a higher onboarding time, as well as a higher cognitive load for existing developers.

- Lots (UI) vs Batches (data)
- Product purchasePrice (data - products) vs wholesaleCost (data - PPO) vs cost (UI)
- Audits vs Invoices (some areas of code)
- Partners (US) vs Integrations (CAN)
- company / tenant
- location / retailer
- location-zones / delivery-zones

### Hackathon ideas

- Implement CDK Nag to safeguard CDK projects
- Fire alarm improvements
  - Mention team related to service
  - Add links to service, dashboards, logs, docs, or other relevant info
  - Add details about the alarm
- add download url to ocs admin tool
- On call rotation tool
- usability metrics
- ecom sms delivery updates
- ~~Admin tool to get company by CRSA~~
- cron fb base db recreate
- OpenAPI to notion doc
- API dependency vetting
- Stack destroyer lambda
- Lambda image processor (cloudinary replacement)
- yarn 4
- Run automated OWASP test on a schedule
  - [https://www.zaproxy.org](https://www.zaproxy.org/)
- PR description AI
  - [Codium-ai](https://github.com/Codium-ai/pr-agent?tab=readme-ov-file#installation)
- [Parade DB](https://www.paradedb.com/)
- Reduce web test memory [swc](https://www.npmjs.com/package/@swc/jest)
  
  ```json
    {
      "jsc": {
        "parser": {
          "syntax": "typescript",
          "tsx": false,
          "decorators": true
        },
        "transform": {
          "legacyDecorator": true,
          "decoratorMetadata": true
        },
        "target": "es2017",
        "keepClassNames": true
      },
      "module": {
        "type": "commonjs",
        "noInterop": false
      }
    }
    ```

- Hubspot CRM to manage dashboard cards: [query-hubspot-data-using-graphql](https://developers.hubspot.com/docs/cms/data/query-hubspot-data-using-graphql)
Itinerary: John H<br />Tuesday, Apr 8, 2025 EDT<br/><br/>1:00PM (EDT) - 2:30PM (EDT): Karthika Rajendran (Senior Software Developer), Lucas Krupa (Staff Software Developer), Thiago Borda (Staff Software Developer)<br/><br/>Hi John,<br/><br/>Here's your calendar invite! You are confirmed for your virtual interview with Karthika Rajendran, Lucas Krupa and Thiago Borda for Tue Apr 8, 2025 at 1:00PM (EDT). Please connect with Karthika Rajendran, Lucas Krupa and Thiago Borda on Zoom. Ensure you’re in a quiet place with steady internet and headphones are recommended.<br/><br/><strong>Your Zoom Link:  https://lightspeed.zoom.us/j/98597644429?pwd=UWp4bAqhuqhHAhsGX1vQuJRXaAZkc9.1</strong><br /><strong>Meeting Password: jAHR3oaH (for phone users: 02232303)</strong><br/><br/><strong>What To Expect:</strong><br />In depth technical interview, system design, advanced coding concepts, testing, problem solving, databases, etc. Collaboration / Communication.<br/><br/>For anything scheduling related, please contact  Yasmine (yasmine.champagne@lightspeedhq.com) and for all other questions please reach out to Nik (nik.arkharov@lightspeedhq.com).<br/><br/>Should you wish to reschedule, you can also use the event confirmation link below ⬇️! <br/><br/> Here's your event confirmation.<br />https://request-availability.goodtime.io/intro/pkKxjakOUVREgwa1 <br/><br/> <a href="https://portal.goodtime.io/candidate-portal/56f6c3e0-2652-499c-a970-1daa3861d4de/8025a5da-63b9-420c-a06b-b15f74c05b1d/404553416"><b>Take me to my portal</b></a> <br/><br/> <<<<<>>>>> 