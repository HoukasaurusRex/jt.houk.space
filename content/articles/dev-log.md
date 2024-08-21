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

## Stardate 2024-08-21

### Leads Meeting

- Discussed stability concerns and how to improve observability of maintenance tasks in priority of feature development

### Architecture Meeting

- Discussed the scope of KML based delivery zones

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

### Hackathon ideas

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
