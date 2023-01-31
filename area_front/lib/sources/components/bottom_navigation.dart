import 'package:area_front/sources/area.dart' as screen;
import 'package:area_front/sources/area_dashboard.dart';
import 'package:flutter/material.dart';

import 'package:area_front/sources/crud/profile.dart';
import 'package:area_front/sources/connection_list.dart';
import 'package:area_front/sources/action.dart' as screen;

class BottomNavigation extends StatefulWidget {
  const BottomNavigation(
      {required this.token, required this.userData, super.key});

  final String token;
  final Map<dynamic, dynamic> userData;

  @override
  State<BottomNavigation> createState() => _BottomNavigationState();
}

class _BottomNavigationState extends State<BottomNavigation> {
  int _selectedIndex = 0;
  static String token = "", areaName = "", areaDescription = "";
  static Map<dynamic, dynamic> userData = {};
  static final List<Widget> _widgetOptions = <Widget>[
    AreaDashboard(userData: userData),
    screen.Area(token: token, userData: userData),
    ConnectionList(token: token),
    Profile(userData: userData),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    token = widget.token;
    userData = widget.userData;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
            backgroundColor: Colors.red,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Services',
            backgroundColor: Colors.orange,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.wifi),
            label: 'Connection List',
            backgroundColor: Colors.yellow,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.perm_identity),
            label: 'Profile',
            backgroundColor: Colors.green,
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.white,
        onTap: _onItemTapped,
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
    );
  }
}
