import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';

import 'package:area_front/sources/components/data.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/loading_screen.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ConnectionList extends StatefulWidget {
  const ConnectionList({required this.token, super.key});

  final String token;

  @override
  State<ConnectionList> createState() => _ConnectionListState();
}

class _ConnectionListState extends State<ConnectionList> {
  final List<ConnectionData> _connectionsDataList = [];
  bool _isLoading = true;

  Future<List<ConnectionData>> _isUserConnected() async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        '/auth/services');
    final response =
        await http.get(url, headers: <String, String>{'token': widget.token});
    print('Connection List : ${response.body}');
    if (response.statusCode == 200) {
      setState(() => _isLoading = false);
      final jsonData = json.decode(response.body);
      final dataList = List<ConnectionData>.empty(growable: true);
      for (final value in jsonData) {
        dataList.add(ConnectionData.fromJson(value));
      }
      return dataList;
    } else {
      setState(() {
        const snackBar =
            SnackBar(content: Text('Error while checking user connectivity'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
      return [];
    }
  }

  Future<void> _launchUrl(String service) async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080', '/auth/$service', {'token': widget.token});
    if (!await launchUrl(url)) {
      throw 'Could not launch $url';
    }
  }

  @override
  void initState() {
    super.initState();
    _isUserConnected().then((value) {
      _connectionsDataList.addAll(value);
    });
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const LoadingScreen()
        : Scaffold(
            resizeToAvoidBottomInset: false,
            appBar: AppBar(
              backgroundColor: Colors.white,
              centerTitle: true,
              shadowColor: Theme.of(context).colorScheme.shadow,
              title: const GradientText(
                'Connections',
                gradient: themedGradient,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
              ),
            ),
            backgroundColor: Colors.transparent,
            body: Container(
              decoration: const BoxDecoration(gradient: themedGradient),
              child: ListView(
                children: <Widget>[
                  GridView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    itemCount: _connectionsDataList.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 5.0,
                      mainAxisSpacing: 5.0,
                    ),
                    itemBuilder: (context, index) {
                      return MyElevatedButton(
                        onPressed: () =>
                            _launchUrl(_connectionsDataList[index].urlName!),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: Card(
                            color: Colors.transparent,
                            shadowColor: Colors.transparent,
                            surfaceTintColor: Colors.transparent,
                            child: ListView(
                              physics: const NeverScrollableScrollPhysics(),
                              children: [
                                SizedBox(
                                  height: 350,
                                  child: Image(
                                      image: CachedNetworkImageProvider(
                                          _connectionsDataList[index].logo!)),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,
                                    children: [
                                      _connectionsDataList[index].loggedIn
                                          ? const Text(
                                              'Connected',
                                              style: TextStyle(
                                                  color: Colors.green),
                                            )
                                          : const Text(
                                              'Disconnected',
                                              style:
                                                  TextStyle(color: Colors.red),
                                            ),
                                      // _connectionsDataList[index].loggedIn
                                      //     ? Text(_connectionsDataList[index]
                                      //         .pseudo!)
                                      //     : const Text(''),
                                    ],
                                  ),
                                )
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          );
  }
}
