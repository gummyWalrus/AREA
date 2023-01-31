import 'package:flutter/material.dart';

import 'package:area_front/sources/connectivity_check_relay.dart';

void main() => runApp(const Area());

/// Entry point
class Area extends StatelessWidget {
  const Area({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: true,
      title: 'Area',
      home: ConnectivityCheckRelay(),
    );
  }
}