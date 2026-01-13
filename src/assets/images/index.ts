type ImageName = string;

const IMAGES: Record<string, any> = {
  //Folder ICON
  'ic_username.png': require('./icon/ic_username.png'),
  'ic_password.png': require('./icon/ic_password.png'),
  'ic_visible.png': require('./icon/ic_visible.png'),
  'ic_email.png': require('./icon/ic_email.png'),
  'ic_menu_wallboard_en.png': require('./icon/ic_menu_wallboard_en.png'),
  'ic_menu_wallboard_dis.png': require('./icon/ic_menu_wallboard_dis.png'),
  'ic_menu_katalog_en.png': require('./icon/ic_menu_katalog_en.png'),
  'ic_menu_katalog_dis.png': require('./icon/ic_menu_katalog_dis.png'),
  'ic_menu_stock_en.png': require('./icon/ic_menu_stock_en.png'),
  'ic_menu_stock_dis.png': require('./icon/ic_menu_stock_dis.png'),
  'ic_menu_more_en.png': require('./icon/ic_menu_more_en.png'),
  'ic_menu_more_dis.png': require('./icon/ic_menu_more_dis.png'),
  'ic_order_white.png': require('./icon/ic_order_white.png'),
  'ic_order.png': require('./icon/ic_order.png'),
  'ic_dealer.png': require('./icon/ic_dealer.png'),
  'ic_dealer_active.png': require('./icon/ic_dealer_active.png'),
  'ic_spring.png': require('./icon/ic_spring.png'),
  'ic_stock_md.png': require('./icon/ic_stock_md.png'),
  'ic_promotion.png': require('./icon/ic_promotion.png'),
  'ic_catalogue.png': require('./icon/ic_catalogue.png'),
  'ic_notification.png': require('./icon/ic_notification.png'),
  'ic_warning_yellow.png': require('./icon/ic_warning_yellow.png'),
  'ic_warning.png': require('./icon/ic_warning.png'),
  'ic_alert.png': require('./icon/ic_alert.png'),
  'ic_info_b.png': require('./icon/ic_info_b.png'),
  'ic_search.png': require('./icon/ic_search.png'),
  'ic_filter.png': require('./icon/ic_filter.png'),
  'ic_arrow_back.png': require('./icon/ic_arrow_back.png'),
  'ic_close_rounded.png': require('./icon/ic_close_rounded.png'),
  'ic_edit.png': require('./icon/ic_edit.png'),
  'ic_file_delete.png': require('./icon/ic_file_delete.png'),
  'ic_add.png': require('./icon/ic_add.png'),
  'ic_check.png': require('./icon/ic_check.png'),
  'ic_profile.png': require('./icon/ic_profile.png'),
  'ic_profile_active.png': require('./icon/ic_profile_active.png'),
  'ic_salesman_visit.png': require('./icon/ic_salesman_visit.png'),
  'ic_visit.png': require('./icon/ic_visit.png'),
  'ic_calendar_form.png': require('./icon/ic_calendar_form.png'),
  'ic_download.png': require('./icon/ic_download.png'),
  'ic_upload.png': require('./icon/ic_upload.png'),
  'ic_camera_white.png': require('./icon/ic_camera_white.png'),
  'ic_field_loc.png': require('./icon/ic_field_loc.png'),
  'ic_homepage.png': require('./icon/ic_homepage.png'),
  'es_no_data.webp': require('./icon/es_no_data.webp'),
  'es_done.webp': require('./icon/es_done.webp'),
  'ic_cart_response.png': require('./icon/ic_cart_response.png'),
  'ic_sort_by.png': require('./icon/ic_sort_by.png'),
  'ic_checklist_enable.png': require('./icon/ic_checklist_enable.png'),
  'ic_pin_map.png': require('./icon/ic_pin_map.png'),
  'ic_contact_wa.png': require('./icon/ic_contact_wa.png'),
  'ic_book_knowledge.png': require('./icon/ic_book_knowledge.png'),
  'ic_plus_en.png': require('./icon/ic_plus_en.png'),
  'ic_min_en.png': require('./icon/ic_min_en.png'),
  'ic_info_badge.png': require('./icon/ic_info_badge.png'),
  'ic_followup_done.png': require('./icon/ic_followup_done.png'),
  'ic_ribbon_discount.png': require('./icon/ic_ribbon_discount.png'),
  'ic_piala.png': require('./icon/ic_piala.png'),
  'ic_spk.png': require('./icon/ic_spk.png'),


  //Folder Background
  'bg_honda.webp': require('./background/bg_honda.webp'),
  'bg_ss.webp': require('./background/bg_ss.webp'),
  'bg_ribbon_red_gagal.webp': require('./background/bg_ribbon_red_gagal.webp'),

  //Folder LogoF
  'logomd.png': require('./logo/logomd.png'),
  'logo_md.png': require('./logo/logo_md.png'),
  'lg_honda.jpg': require('./logo/lg_honda.jpg'),
  'lg_honda.webp': require('./logo/lg_honda.webp'),
};

export const getImage = (name: ImageName) => {
  return IMAGES[name] || IMAGES['es_no_data.webp'];
};

export default getImage;
