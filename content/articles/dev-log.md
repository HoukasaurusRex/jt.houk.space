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

## Stardate 2024-08-20

### Custom fields product import / export meeting

- Discussed the options for custom fields in the product import / export process
- Recommended treating any unknown columns in csv as custom fields

### System Review

### Inventory Snapshots

- Removed updating batch inventory on audit update
