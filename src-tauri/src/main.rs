// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::
{
    CustomMenuItem,
    Manager, Menu, MenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    Submenu, Window,
};

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload
{
    message: String,
}



// init a background process on the command, and emit periodic events only to the window that used the command
#[tauri::command]
fn init_process(window: Window)
{
  std::thread::spawn(move || {
    loop {
      window.emit("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
    }
  });
}

fn main()
{
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let hide  = CustomMenuItem::new("hide".to_string(), "Hide");
    let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));

    let menu = Menu::new()
    .add_submenu(submenu)
    .add_native_item(MenuItem::Copy)
    .add_item( hide );

    let quits = CustomMenuItem::new("quit".to_string(), "Quit");
    let closes = CustomMenuItem::new("close".to_string(), "Close");

    let tray_menu = SystemTrayMenu::new()
    .add_item(quits)
    .add_native_item(SystemTrayMenuItem::Separator);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
    .setup(|app|
    {
        // `main` here is the window label; it is defined on the window creation or under `tauri.conf.json`
        // the default value is `main`. note that it must be unique
        let main_window = app.get_window("main").unwrap();

        // listen to the `event-name` (emitted on the `main` window)
        let id = main_window.listen("event-name", |event| {
        println!("got window event-name with payload {:?}", event.payload());
        });

        // unlisten to the event using the `id` returned on the `listen` function
        // an `once` API is also exposed on the `Window` struct
        main_window.unlisten(id);

        // emit the `event-name` event to the `main` window
        main_window.emit("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
        Ok(())
        }).menu(menu)
        .on_menu_event(|event|
        {
            match event.menu_item_id()
            {
                "quit" =>
                {
                    std::process::exit(0);
                }
                "close" =>
                {
                    event.window().close().unwrap();
                }

                _ => {}
        }
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event
    {
          SystemTrayEvent::LeftClick
          {
            position: _,
            size: _,
            ..
          } =>
          {
            println!("system tray received a left click");
          }

          SystemTrayEvent::RightClick
          {
            position: _,
            size: _,
            ..
          } =>
          {
            println!("system tray received a right click");
          }
          SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
          } => {
            println!("system tray received a double Click");
          }
          SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
              "quit" => {
                std::process::exit(0);
              }
              _ => {}
            }
          }
          _ => {}
        })
    .invoke_handler(tauri::generate_handler![init_process])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}