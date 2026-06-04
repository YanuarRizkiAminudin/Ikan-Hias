export interface Category {
  id:          string
  name:        string
  slug:        string
  description: string | null
  image_url:   string | null
  is_active:   boolean
  created_at:  string
}

export interface Product {
  id:          string
  category_id: string
  name:        string
  slug:        string
  description: string | null
  price:       number
  stock:       number
  size:        string | null
  image_url:   string | null
  video_url:   string | null
  is_featured: boolean
  status:      'active' | 'inactive' | 'out_of_stock'
  created_at:  string
  categories?: Category
}

export interface Inquiry {
  id:                string
  company_name:      string
  contact_name:      string
  email:             string
  phone:             string | null
  country:           string
  fish_types:        string
  quantity_estimate: string | null
  message:           string | null
  status:            'new' | 'read' | 'replied'
  created_at:        string
}

export interface StoreInfo {
  id:             number
  store_name:     string
  tagline:        string | null
  address:        string | null
  phone_wa:       string | null
  email:          string | null
  maps_embed_url: string | null
  instagram:      string | null
  facebook:       string | null
  open_hours:     string | null
  about_text:     string | null
  updated_at:     string
}

export interface Profile {
  id:         string
  name:       string | null
  role:       string
  created_at: string
}
