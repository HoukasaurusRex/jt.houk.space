---
  id: 12
  category: "coding"
  Title: "Dev Log"
  created_at: "2020-03-23T07:19:55.187Z"
  updated_at: "2021-03-04T10:01:20.550Z"
  title: "Dev Log"
  tags: 
    - "coding"
    - "dev"
    - "log"
    - "journal"
  description: null
  status: "published"
  summary: "A log of my daily coding activities."
  author: "JT Houk"
  location: "Montreal"
  date: "2024-08-16"
  image: ""
  images: []

---

> "The unexamined life is not worth living." - Socrates

## Stardate 2024-08-30

### Hotfixes

- Helped Jheysson with product price export query scaling issues
- Fixed ON compliance manual reports retry issue

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

### Retro topics

### System improvements

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
