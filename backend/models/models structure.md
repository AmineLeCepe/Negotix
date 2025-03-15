# Databases:
## User:
- id (primary key)
- username
- email
- passwordHash
- createdAt
- isAdmin (bool)
## Auction:
- id (primary key)
- sellerId (foreign key references users)
- highestBidId (not required, references bids)
- title
- description
- categoryId (foreign key references category)
- startingPrice
- latestPrice (not required)
- creationDate
- endDate
- isCompleted (bool)
## Review:
- id (primary key)
- auctionId (foreign key references auctions)
- stars (int 1 to 5)
- content (not required)
## Wishlist:
- userId (references users)
- auctions (array of foreign keys (auction ids) referencing auctions) (not required)
## Bid:
- id (primary key)
- auctionId (foreign key references auctions)
- userId (foreign key references users)
- amount
- isAnonymous (bool)
- creationDate
## Chat:
- id (primary key)
- auctionId (foreign key references auctions)
- userId (foreign key references users) (not required)
## Message:
- id (primary key)
- chatId (foreign key references chats)
- content
- creationDate
- isDeleted (bool, deletion feature only available to staff)
## Category:
- id (primary key)
- name
# Constraints:
## User:
- username must be between 3 and 16 characters long
- password input (not hash) must be between 8 and 20 characters long
## Auction:
- title must be between 3 and 30 characters long
- description cannot be longer than 3000 characters
- currentPrice cannot be lower than startingPrice
- endDate cannot be earlier than creationDate
## Review:
- content cannot be longer than 3000 characters
## Wishlist:
- user cannot wishlist the same item multiple times
## Bid:
- amount cannot be lower than currentPrice AND startingPrice on same auction
## Message:
- content cannot be longer than 500 characters