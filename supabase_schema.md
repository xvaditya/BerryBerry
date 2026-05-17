# Supabase Setup Guide

Please copy the SQL code below and paste it into the **SQL Editor** in your Supabase dashboard, then click **Run**.

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Chats Table
create table public.chats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Messages Table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.chats enable row level security;
alter table public.messages enable row level security;

create policy "Users can manage own chats"
on chats for all
using (auth.uid() = user_id);

create policy "Users can manage own messages"
on messages for all
using (
  chat_id in (
    select id from chats where user_id = auth.uid()
  )
);

-- Set up Storage Bucket Policies (Assuming bucket is named 'attachments')
-- IMPORTANT: Make sure you created a public storage bucket named "attachments" first!
create policy "Users can upload attachments" on storage.objects for insert with check ( bucket_id = 'attachments' and auth.uid() = owner );
create policy "Anyone can view attachments" on storage.objects for select using ( bucket_id = 'attachments' );
```

### Next Steps:
1. Don't forget to create a new storage bucket in the **Storage** tab and name it exactly `attachments`. Make sure you toggle it to "Public".
2. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the `.env` file in the project.
